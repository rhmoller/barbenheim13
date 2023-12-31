import { Game } from "./game.ts";
import {
  FoeComponent,
  PlayerComponent,
  RangedComponent,
  ShootComponent,
  SpriteComponent,
} from "./components.ts";
import { findPath, hDist } from "../engine/findPath.ts";
import { findSprite, isFreeTile } from "./levelGenerator.ts";
import { getTilePos } from "./inputSystem.ts";

export function enemySystem(game: Game) {
  if (game.side !== "foe" || game.commandQueue.length > 0) return;
  if (game.ecs.getComponentsByType("move").length > 0) return;

  const foe = game.ecs.getComponentsByType<FoeComponent>("foe").find((c) => {
    return !c.moved;
  });
  if (foe) {
    const players = game.ecs.getComponentsByType<PlayerComponent>("player");
    let closestPlayer = { entity: players[0].entity, distance: 1000 };
    const foeSprite = game.ecs.getComponent<SpriteComponent>(foe.entity, "sprite")!;
    foe.moved = true;

    players.forEach((player) => {
      const playerSprite = game.ecs.getComponent<SpriteComponent>(player.entity, "sprite")!;
      const distance =
        Math.abs(playerSprite.x - foeSprite.x) + Math.abs(playerSprite.y - foeSprite.y);
      if (distance < closestPlayer.distance) {
        closestPlayer = { entity: player.entity, distance };
      }
    });

    const playerSprite = game.ecs.getComponent<SpriteComponent>(closestPlayer.entity, "sprite")!;
    const playerPos = getTilePos(playerSprite);
    const foePos = getTilePos(foeSprite);

    const pathObj = findPath(
      (p) =>
        (p.x === foePos.x && p.y === foePos.y) ||
        (p.x === playerPos.x && p.y === playerPos.y) ||
        isFreeTile(game.ecs, game.tilemap!, game.objmap!, p),
      foePos,
      playerPos,
    );
    const path = pathObj.path;
    if (path && path.length > 0) {
      let lastIndex = Math.min(path.length - 1, foe.speed);
      const lastPos = path[lastIndex];
      const sprite = findSprite(game.ecs, lastPos.x, lastPos.y);
      if (sprite) {
        const targetfoe = game.ecs.getComponent<FoeComponent>(sprite.entity, "foe");
        if (targetfoe) {
          lastIndex--;
        }

        if (lastIndex > 0) {
          game.commandQueue.push({
            entity: foe.entity,
            type: "move",
            path: path.slice(0, lastIndex),
            idx: 0,
            speed: foe.speed,
          });
        }
        const player = game.ecs.getComponent<PlayerComponent>(sprite.entity, "player");

        if (player) {
          game.commandQueue.push({
            entity: foe.entity,
            type: "attack",
            pos: lastPos,
            ttl: 20,
            ranged: false,
          });
        }
      } else {
        game.commandQueue.push({
          entity: foe.entity,
          type: "move",
          path: path.slice(0, foe!.speed),
          idx: 0,
          speed: foe.speed,
        });

        const shooter = game.ecs.getComponent<ShootComponent>(foe.entity, "shoot")!;
        const ranged = game.ecs.getComponent<RangedComponent>(foe.entity, "ranged")!;
        if (shooter && ranged && ranged.action === "attack") {
          if (hDist(playerPos, foePos) <= ranged.range) {
            game.commandQueue.push({
              entity: foe.entity,
              type: "shoot",
              pos: playerPos,
              idx: 0,
            });
          }
        }
      }
    }
  } else if (game.commandQueue.length === 0) {
    game.side = "player";
    game.ecs.getComponentsByType<PlayerComponent>("player").forEach((c) => {
      c.moved = false;
    });
    game.ecs.getComponentsByType<PlayerComponent>("foe").forEach((c) => {
      c.moved = false;
    });
  }
}
