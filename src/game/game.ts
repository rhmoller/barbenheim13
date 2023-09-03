import { Ecs, Entity } from "../engine/Ecs.ts";
import { TileMap } from "../engine/tilemap.ts";
import { Command } from "./commands.ts";
import { Point } from "../engine/findPath.ts";
import { spriteNames } from "./sprites.ts";

export interface Cursor {
  x: number;
  y: number;
}

export class Game {
  t = 0;
  ecs = new Ecs();
  activePlayer: Entity | null = null;
  cursor: Point = { x: 0, y: 0 };
  prevCursor: Point = { x: 0, y: 0 };
  eventQueue: any[] = [];
  tilemap: TileMap | null = null;
  side: "player" | "foe" = "player";
  commandPreview: Command[] = [];
  commandQueue: Command[] = [];
  inventory = {
    ore: 0,
  };
  state: "playing" | "win" | "lose" = "playing";

  init() {
    const ecs = this.ecs;

    const player = ecs.createEntity();
    ecs.addComponents(
      player,
      {
        type: "player",
        moved: false,
        baseClass: "swordsman",
        health: 15,
        maxHealth: 15,
        strength: 7,
        speed: 5,
      },
      { type: "sprite", x: 8 * 16, y: 3 * 16, sprite: spriteNames.swordsman },
    );

    const player2 = ecs.createEntity();
    ecs.addComponents(
      player2,
      {
        type: "player",
        moved: false,
        baseClass: "dwarf",
        health: 17,
        maxHealth: 17,
        strength: 5,
        speed: 5,
      },
      { type: "sprite", x: 8 * 16, y: 5 * 16, sprite: spriteNames.dwarf },
    );

    const player3 = ecs.createEntity();
    ecs.addComponents(
      player3,
      {
        type: "player",
        moved: false,
        baseClass: "archer",
        health: 12,
        maxHealth: 12,
        strength: 3,
        speed: 5,
      },
      { type: "sprite", x: 6 * 16, y: 4 * 16, sprite: spriteNames.archer },
      { type: "shoot", bullet: spriteNames.arrow },
    );

    const player4 = ecs.createEntity();
    ecs.addComponents(
      player4,
      {
        type: "player",
        moved: false,
        baseClass: "trebuchet",
        health: 7,
        maxHealth: 7,
        strength: 99,
        speed: 3,
      },
      { type: "sprite", x: 6 * 16, y: 6 * 16, sprite: spriteNames.trebuchet },
      { type: "shoot", bullet: spriteNames.bomb },
    );

    const foe = ecs.createEntity();
    ecs.addComponents(
      foe,
      {
        type: "foe",
        moved: false,
        baseClass: "orc",
        health: 10,
        maxHealth: 10,
        strength: 1,
        speed: 5,
      },
      { type: "sprite", x: 20 * 16, y: 10 * 16, sprite: spriteNames.orc },
    );

    const foe2 = ecs.createEntity();
    ecs.addComponents(
      foe2,
      {
        type: "foe",
        moved: false,
        baseClass: "orc",
        health: 10,
        maxHealth: 10,
        strength: 1,
        speed: 5,
      },
      { type: "sprite", x: 21 * 16, y: 12 * 16, sprite: spriteNames.orc },
    );

    const dragon = ecs.createEntity();
    ecs.addComponents(
      dragon,
      {
        type: "foe",
        moved: false,
        baseClass: "dragon",
        health: 57,
        maxHealth: 57,
        strength: 11,
        speed: 3,
      },
      { type: "sprite", x: 23 * 16, y: 9 * 16, sprite: spriteNames.dragon1 },
    );
  }
}
