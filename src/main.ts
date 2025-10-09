import "./style.css";
import tutorialPng from "./compressed/tutorial.png";
import findPng from "./compressed/find.png";
import hoGuiPng from "./compressed/ho_gui.png";
import balerinaPng from "./compressed/balerina.png";
import bgHoPng from "./compressed/bg_ho.png";
import bookPng from "./compressed/book.png";
import basketPng from "./compressed/basket.png";
import fanPng from "./compressed/fan.png";
import bgBlurPng from "./compressed/bg_blur.png";
import logoPng from "./compressed/logo.png";
import buttonPng from "./compressed/button.png";
import playFreePng from "./compressed/play_free.png";
import {
  Application,
  Sprite,
  Container,
  Ticker,
  Text,
  Graphics,
  TextStyle,
  Assets,
} from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();
  // Track found items
  const foundItems = new Set<string>();

  // Initialize the application with a black background
  await app.init({ background: "#000000", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Create textures from base64 strings
  const tutorialTexture = await Assets.load(tutorialPng);
  const tutorialTextTexture = await Assets.load(findPng);
  const guiTextTexture = await Assets.load(hoGuiPng);
  const backgroundTexture = await Assets.load(bgHoPng);
  const bookTexture = await Assets.load(bookPng);
  const balerinaTexture = await Assets.load(balerinaPng);
  const basketTexture = await Assets.load(basketPng);
  const fanTexture = await Assets.load(fanPng);
  const bgBlurTexture = await Assets.load(bgBlurPng);
  const logoTexture = await Assets.load(logoPng);
  const buttonTexture = await Assets.load(buttonPng);
  const playFreeTexture = await Assets.load(playFreePng);

  // Create sprites from textures
  const tutorialSprite = new Sprite(tutorialTexture);
  const tutorialTextSprite = new Sprite(tutorialTextTexture);
  const guiTextSprite = new Sprite(guiTextTexture);
  const backgroundSprite = new Sprite(backgroundTexture);
  const bookSprite = new Sprite(bookTexture);
  const balerinaSprite = new Sprite(balerinaTexture);
  const basketSprite = new Sprite(basketTexture);
  const fanSprite = new Sprite(fanTexture);
  const bgBlurSprite = new Sprite(bgBlurTexture);
  const logoSprite = new Sprite(logoTexture);
  const buttonSprite = new Sprite(buttonTexture);
  const playFreeSprite = new Sprite(playFreeTexture);

  // Set the background to dynamically adjust to the screen size
  const resizeBackground = () => {
    // Scale based on vertical height to fill vertical space
    const scale = app.screen.height / backgroundSprite.texture.height;

    // Set background size preserving aspect ratio, scaled by vertical scale
    backgroundSprite.width = backgroundSprite.texture.width * scale;
    backgroundSprite.height = app.screen.height;

    // Position background centered horizontally but cropped on left/right if wider
    backgroundSprite.position.set(
      (app.screen.width - backgroundSprite.width) / 2, // negative offset if crop needed
      0, // aligned at top vertically
    );
  };

  // Initial resize
  resizeBackground();

  // Add the background to the stage
  app.stage.addChild(backgroundSprite);

  // Create a container for the tutorial
  const tutorialContainer = new Container();
  const guiContainer = new Container();

  // Add the sprites to the container
  tutorialContainer.addChild(tutorialSprite);
  tutorialContainer.addChild(tutorialTextSprite);
  guiContainer.addChild(guiTextSprite);

  // Add text to the guiContainer
  const textStyle = new TextStyle({
    fill: "3f0000",
    fontSize: 24,
    align: "center",
  });

  const bookText = new Text("Book", textStyle);
  const fanText = new Text("Fan", textStyle);
  const balerinaText = new Text("Balerina", textStyle);
  const basketText = new Text("Basket", textStyle);

  // Position the text in the middle of each quarter of the screen
  bookText.position.set(
    app.screen.width / 10 - bookText.width / 2,
    guiTextSprite.height / 2,
  );
  fanText.position.set(
    (app.screen.width * 4) / 10 - fanText.width / 2,
    guiTextSprite.height / 2,
  );
  balerinaText.position.set(
    (app.screen.width * 6) / 10 - balerinaText.width / 2,
    guiTextSprite.height / 2,
  );
  basketText.position.set(
    (app.screen.width * 7) / 10 - basketText.width / 2,
    guiTextSprite.height / 2,
  );

  // Add the text to the guiContainer
  guiContainer.addChild(bookText);
  guiContainer.addChild(fanText);
  guiContainer.addChild(balerinaText);
  guiContainer.addChild(basketText);

  // Set the tutorial container to dynamically adjust its size and position
  const resizeTutorialContainer = () => {
    // Scale the tutorial sprite to 1/5 of its default size
    const scale = 2 / 5;
    tutorialSprite.width = tutorialSprite.texture.width * scale;
    tutorialSprite.height = tutorialSprite.texture.height * scale;

    // Position the tutorial text below the tutorial sprite
    tutorialTextSprite.width = tutorialTextSprite.texture.width * scale;
    tutorialTextSprite.height = tutorialTextSprite.texture.height * scale;

    guiTextSprite.width = guiTextSprite.texture.width * scale;
    guiTextSprite.height = guiTextSprite.texture.height * scale;
    tutorialTextSprite.position = tutorialSprite.position;

    // Position the tutorial text in the center of the tutorial sprite
    tutorialTextSprite.position.set(
      tutorialSprite.width / 2 - tutorialTextSprite.width / 2,
      tutorialSprite.height / 2 - tutorialTextSprite.height / 2 + 10,
    );

    // Center the container at 4/5 of the screen height
    tutorialContainer.position.set(
      app.screen.width / 2 - tutorialContainer.width / 2,
      app.screen.height / 5 - tutorialContainer.height / 2,
    );

    // Scale and position the GUI text sprite
    guiTextSprite.width = guiTextSprite.texture.width * scale * 1.1;
    guiTextSprite.height = guiTextSprite.texture.height * scale;
    guiTextSprite.position.set(
      app.screen.width / 2 - guiTextSprite.width / 2, // Center horizontally
      app.screen.height - guiTextSprite.height, // Position at the bottom with a 20px margin
    );

    // Reposition the text in the guiContainer
    bookText.position.set(
      app.screen.width / 8 - bookText.width / 2,
      guiTextSprite.position.y + guiTextSprite.height / 2 - bookText.height / 2,
    );
    fanText.position.set(
      (app.screen.width * 3) / 8 - fanText.width / 2,
      guiTextSprite.position.y + guiTextSprite.height / 2 - fanText.height / 2,
    );
    balerinaText.position.set(
      (app.screen.width * 5) / 8 - balerinaText.width / 2,
      guiTextSprite.position.y +
        guiTextSprite.height / 2 -
        balerinaText.height / 2,
    );
    basketText.position.set(
      (app.screen.width * 7) / 8 - basketText.width / 2,
      guiTextSprite.position.y +
        guiTextSprite.height / 2 -
        basketText.height / 2,
    );
  };

  // Initial resize for the tutorial container
  resizeTutorialContainer();

  // Add the tutorial container to the stage
  app.stage.addChild(tutorialContainer);
  app.stage.addChild(guiContainer);

  // Set the pivot of the tutorial container to its center
  tutorialContainer.pivot.set(
    tutorialContainer.width / 2,
    tutorialContainer.height / 2,
  );

  // Adjust the position to place it at the center horizontally and 1/5 of the screen height vertically
  tutorialContainer.position.set(app.screen.width / 2, app.screen.height / 5);

  // Add pulsing animation to the tutorial container
  let scaleDirection = 1; // 1 for scaling up, -1 for scaling down
  const ticker = new Ticker();
  ticker.add(() => {
    // Adjust the scale of the tutorial container
    tutorialContainer.scale.x += 0.002 * scaleDirection;
    tutorialContainer.scale.y += 0.002 * scaleDirection;

    // Reverse direction when reaching scale limits
    if (tutorialContainer.scale.x > 1.05 || tutorialContainer.scale.x < 0.95) {
      scaleDirection *= -1;
    }
  });
  ticker.start();

  // Listen for window resize to adjust both sprites dynamically
  window.addEventListener("resize", () => {
    resizeBackground();
    resizeTutorialContainer();
  });

  // Function to create a fade-out effect
  const fadeOutAndRemove = (
    sprite: Sprite,
    stage: Container,
    duration: number = 1000,
  ) => {
    const fadeStep = 1 / (duration / 16.67); // Approximate 60 FPS
    const fadeTicker = new Ticker();

    fadeTicker.add(() => {
      sprite.alpha -= fadeStep;
      if (sprite.alpha <= 0) {
        sprite.alpha = 0; // Ensure alpha doesn't go below 0
        fadeTicker.stop(); // Stop the animation
        stage.removeChild(sprite); // Remove the sprite from the stage
      }
    });

    fadeTicker.start();
  };

  // Function to cross out text
  const crossOutText = (text: Text, container: Container) => {
    console.log("Text Position:", text.x, text.y);
    console.log("Text Dimensions:", text.width, text.height);

    // Update the text style to gray and italic
    text.style = new TextStyle({
      ...text.style,
      fill: "#888888", // Change color to gray
      fontStyle: "italic", // Make it italic
    });

    // Draw a line through the text
    const line = new Graphics();
    line.lineStyle(2, 0xffffff, 1); // White line with 2px thickness and full opacity

    // Get the global bounds of the text
    const bounds = text.getBounds();
    console.log("Text Global Bounds:", bounds);

    line.moveTo(bounds.x, bounds.y + bounds.height / 2); // Start at the middle-left of the text
    line.lineTo(bounds.x + bounds.width, bounds.y + bounds.height / 2); // End at the middle-right of the text

    // Add the line to the same container as the text
    container.addChild(line);
  };

  // Function to pulse an item
  const pulseItem = (sprite: Sprite) => {
    let scaleDirection = 1; // 1 for scaling up, -1 for scaling down
    const pulseTicker = new Ticker();

    pulseTicker.add(() => {
      sprite.scale.x += 0.005 * scaleDirection;
      sprite.scale.y += 0.005 * scaleDirection;

      if (sprite.scale.x > 1.1 || sprite.scale.x < 0.9) {
        scaleDirection *= -1;
      }
    });

    pulseTicker.start();

    // Stop pulsing when the item is found
    sprite.once("pointerdown", () => {
      pulseTicker.stop();
      sprite.scale.set(1); // Reset scale
    });
  };

  // Function to highlight the first unfound item
  const highlightFirstUnfoundItem = () => {
    if (!foundItems.has("book")) {
      pulseItem(bookSprite);
    } else if (!foundItems.has("fan")) {
      pulseItem(fanSprite);
    } else if (!foundItems.has("balerina")) {
      pulseItem(balerinaSprite);
    } else if (!foundItems.has("basket")) {
      pulseItem(basketSprite);
    }
  };

  // Timer for inactivity
  let inactivityTimer: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      highlightFirstUnfoundItem();
    }, 5000); // 5 seconds of inactivity
  };

  // Set anchor and position for each sprite
  bookSprite.anchor.set(0.5);
  balerinaSprite.anchor.set(0.5);
  basketSprite.anchor.set(0.5);
  fanSprite.anchor.set(0.5);

  bookSprite.position.set(app.screen.width / 2, app.screen.height / 2);
  balerinaSprite.position.set(app.screen.width / 4, app.screen.height / 2);
  basketSprite.position.set(app.screen.width / 2, app.screen.height / 2);
  fanSprite.position.set((app.screen.width * 3) / 4, app.screen.height / 2);

  // Add the sprites to the stage
  app.stage.addChild(bookSprite);
  app.stage.addChild(balerinaSprite);
  app.stage.addChild(basketSprite);
  app.stage.addChild(fanSprite);

  // Add interactivity to each sprite
  bookSprite.interactive = true;
  bookSprite.on("pointerdown", () => {
    fadeOutAndRemove(bookSprite, guiContainer);
    crossOutText(bookText, app.stage); // Pass the text and stage
    resetInactivityTimer();
    foundItems.add("book");
    if (foundItems.size === 4) showEndScreen(); // Check if all items are found
  });

  balerinaSprite.interactive = true;
  balerinaSprite.on("pointerdown", () => {
    fadeOutAndRemove(balerinaSprite, app.stage);
    crossOutText(balerinaText, guiContainer); // Pass the text and stage
    resetInactivityTimer();
    foundItems.add("balerina");
    if (foundItems.size === 4) showEndScreen(); // Check if all items are found
  });

  basketSprite.interactive = true;
  basketSprite.on("pointerdown", () => {
    fadeOutAndRemove(basketSprite, app.stage);
    crossOutText(basketText, guiContainer); // Pass the text and stage
    resetInactivityTimer();
    foundItems.add("basket");
    if (foundItems.size === 4) showEndScreen(); // Check if all items are found
  });

  fanSprite.interactive = true;
  fanSprite.on("pointerdown", () => {
    fadeOutAndRemove(fanSprite, app.stage);
    crossOutText(fanText, app.stage); // Pass the text and stage
    resetInactivityTimer();
    foundItems.add("fan");
    if (foundItems.size === 4) showEndScreen(); // Check if all items are found
  });

  // Function to show the end screen
  const showEndScreen = () => {
    // Remove all items from the stage
    app.stage.removeChildren();

    bgBlurSprite.width = app.screen.width;
    bgBlurSprite.height = app.screen.height;
    app.stage.addChild(bgBlurSprite);

    logoSprite.anchor.set(0.5);
    logoSprite.position.set(app.screen.width / 2, app.screen.height / 3);
    app.stage.addChild(logoSprite);

    // Create the button container
    const buttonContainer = new Container();

    buttonSprite.anchor.set(0.5);
    buttonContainer.addChild(buttonSprite);

    playFreeSprite.anchor.set(0.5);
    buttonContainer.addChild(playFreeSprite);

    // Position the button container
    buttonContainer.position.set(
      app.screen.width / 2,
      (app.screen.height * 2) / 3,
    );
    app.stage.addChild(buttonContainer);

    // Add pulsing animation to the button
    let scaleDirection = 1; // 1 for scaling up, -1 for scaling down
    const buttonTicker = new Ticker();
    buttonTicker.add(() => {
      buttonContainer.scale.x += 0.005 * scaleDirection;
      buttonContainer.scale.y += 0.005 * scaleDirection;

      if (buttonContainer.scale.x > 1.1 || buttonContainer.scale.x < 0.9) {
        scaleDirection *= -1;
      }
    });
    buttonTicker.start();

    // Add interactivity to the button
    buttonContainer.interactive = true;
    buttonContainer.on("pointerdown", () => {
      console.log("Play button clicked!");
      // Add logic to restart the game or navigate to another screen
    });
  };

  resetInactivityTimer();

  // Listen for window resize to reposition the sprites
  window.addEventListener("resize", () => {
    bookSprite.position.set(app.screen.width / 2, app.screen.height / 2);
    balerinaSprite.position.set(app.screen.width / 4, app.screen.height / 2);
    basketSprite.position.set(app.screen.width / 2, app.screen.height / 2);
    fanSprite.position.set((app.screen.width * 3) / 4, app.screen.height / 2);
  });
})();
