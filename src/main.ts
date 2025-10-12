import { MraidHelper } from "./mraid-helper";
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
  TextStyle,
  Assets,
} from "pixi.js";

const startPixiApp = async () => {
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
  guiContainer.addChild(guiTextSprite);
  guiContainer.addChild(bookText);
  guiContainer.addChild(fanText);
  guiContainer.addChild(balerinaText);
  guiContainer.addChild(basketText);

  // // Set the tutorial container to dynamically adjust its size and position
  const resizeTutorialContainer = () => {
    const scale = 1.5 / 5;
    tutorialSprite.width = tutorialSprite.texture.width * scale;
    tutorialSprite.height = tutorialSprite.texture.height * scale;

    // Position the tutorial text below the tutorial sprite
    tutorialTextSprite.width = tutorialTextSprite.texture.width * scale;
    tutorialTextSprite.height = tutorialTextSprite.texture.height * scale;

    tutorialTextSprite.position = tutorialSprite.position;
    // Position the tutorial text in the center of the tutorial sprite
    tutorialTextSprite.position.set(
      tutorialSprite.width / 2 - tutorialTextSprite.width / 2,
      tutorialSprite.height / 2 - tutorialTextSprite.height / 2 + 10,
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

  const pulseItem = (sprite: Container) => {
    let scaleDirection = 1;
    const minPulse = 0.9;
    const maxPulse = 1.1;
    const scaleStep = 0.005;
    let pulseFactor = 1.0;

    // Store the sprite’s current “default” scale
    const baseScaleX = sprite.scale.x;
    const baseScaleY = sprite.scale.y;

    const pulseTicker = new Ticker();

    pulseTicker.add(() => {
      // Update pulse factor
      pulseFactor += scaleStep * scaleDirection;

      // Reverse when hitting bounds
      if (pulseFactor >= maxPulse || pulseFactor <= minPulse) {
        scaleDirection *= -1;
        pulseFactor = Math.min(Math.max(pulseFactor, minPulse), maxPulse);
      }

      // Apply scale relative to base
      sprite.scale.set(baseScaleX * pulseFactor, baseScaleY * pulseFactor);
    });

    pulseTicker.start();

    sprite.once("pointerdown", () => {
      pulseTicker.stop();
      sprite.scale.set(baseScaleX, baseScaleY); // reset to default
    });
  };

  pulseItem(tutorialContainer);

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

  const crossOutText = (text: Text, container: Container) => {
    // Calculate the number of dashes (half the number of characters in the text)
    const dashCount = Math.ceil(text.text.length / 2);
    const dashes = "—".repeat(dashCount); // Create a string of dashes

    // Create a new Text element with the calculated dashes
    const dashText = new Text(dashes, {
      fill: "#3f0000", // Color for the dashes
      fontSize: text.style.fontSize, // Match the font size of the original text
      fontWeight: "bold", // Make the dashes bold
      align: "center",
    });

    // Position the dashes over the original text
    dashText.anchor.set(0.5); // Center the dashes
    dashText.position.set(
      text.x + text.width / 2, // Center horizontally over the original text
      text.y + text.height / 2, // Center vertically over the original text
    );

    // Add the dashes to the same container as the text
    container.addChild(dashText);
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

  bookSprite.position.set(app.screen.width / 2, (app.screen.height / 2) * 1.5);
  balerinaSprite.position.set(
    app.screen.width / 2,
    (app.screen.height / 2) * 1.05,
  );
  basketSprite.position.set(
    (app.screen.width / 4) * 1.14,
    (app.screen.height / 4) * 3.2,
  );
  fanSprite.position.set(
    (app.screen.width * 3.5) / 4,
    (app.screen.height / 2) * 1.2,
  );

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

  const portrait = window.innerHeight > window.innerWidth; // isPortrait
  const showEndScreen = () => {
    // Remove all items from the stage
    app.stage.removeChildren();

    const scale = app.screen.height / backgroundSprite.texture.height;

    // Set the background to fill the screen
    bgBlurSprite.width = bgBlurSprite.texture.width * scale;
    bgBlurSprite.height = app.screen.height;
    app.stage.addChild(bgBlurSprite);

    // Center the background horizontally
    bgBlurSprite.position.set(
      (app.screen.width - bgBlurSprite.width) / 2, // Center horizontally
      0, // Align to the top vertically
    );

    // Scale and position the logo
    logoSprite.anchor.set(0.5);
    logoSprite.scale.set(portrait ? scale * 0.6 : scale); // Downscale the logo
    logoSprite.position.set(app.screen.width / 2, app.screen.height / 3);
    app.stage.addChild(logoSprite);

    // Create the button container
    const buttonContainer = new Container();

    // Scale and position the button
    buttonSprite.anchor.set(0.5);
    buttonSprite.scale.set(scale); // Downscale the button
    buttonContainer.addChild(buttonSprite);

    // Scale and center the "Play Free" text inside the button
    playFreeSprite.anchor.set(0.5);
    playFreeSprite.scale.set(scale * 0.8); // Slightly smaller than the button
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
      MraidHelper.instance.open("https://play.google.com/");
    });
  };

  // Call once after init and on resize
  const resizeAll = () => {
    // Base scaling relative to the shorter side for consistency
    const baseScale = Math.min(app.screen.width, app.screen.height) / 800; // tune 800 as a virtual design size

    // Slightly larger in portrait to keep readability
    const tScale = baseScale * (portrait ? 0.8 : 0.75);
    tutorialContainer.scale.set(tScale);

    // Place higher in portrait so items have room below
    tutorialContainer.position.set(
      app.screen.width * 0.5,
      portrait ? app.screen.height * 0.2 : app.screen.height * 0.18,
    );

    // ----- GUI bottom bar -----
    // Scale gui texture then position flush to bottom
    const guiScale = baseScale * (portrait ? 1.2 : 1.15) * 0.4;
    guiTextSprite.scale.set(guiScale);
    guiTextSprite.position.set(
      app.screen.width / 2 - guiTextSprite.width / 2,
      app.screen.height - guiTextSprite.height,
    );

    // Adaptive font sizes
    const newFontSize = Math.round(baseScale * (portrait ? 34 : 26));
    [bookText, fanText, balerinaText, basketText].forEach((t) => {
      t.style.fontSize = newFontSize;
    });

    // Positions across the bottom bar
    const xRatios = portrait ? [0.2, 0.45, 0.65, 0.9] : [0.2, 0.4, 0.6, 0.8];
    const texts = [bookText, fanText, balerinaText, basketText];
    texts.forEach((t, i) => {
      t.position.set(
        app.screen.width * xRatios[i] - t.width / 2,
        guiTextSprite.position.y + guiTextSprite.height / 2 - t.height / 2,
      );
    });

    // ----- Interactive items (book, balerina, basket, fan) -----
    // Keep their anchors centered as already set
    const itemScale = baseScale * (portrait ? 0.37 : 0.25);
    [bookSprite, balerinaSprite, basketSprite, fanSprite].forEach((s) => {
      s.scale.set(itemScale);
    });

    // Portrait: cluster tighter vertically, broader horizontally
    if (portrait) {
      bookSprite.position.set(app.screen.width * 0.3, app.screen.height * 0.56);
      balerinaSprite.position.set(
        app.screen.width * 0.6,
        app.screen.height * 0.5,
      );
      basketSprite.position.set(
        app.screen.width * 0.2,
        app.screen.height * 0.8,
      );
      fanSprite.position.set(app.screen.width * 0.95, app.screen.height * 0.78);
    } else {
      // Landscape: spread more horizontally
      bookSprite.position.set(
        app.screen.width * 0.25,
        app.screen.height * 0.55,
      );
      balerinaSprite.position.set(
        app.screen.width * 0.45,
        app.screen.height * 0.7,
      );
      basketSprite.position.set(
        app.screen.width * 0.65,
        app.screen.height * 0.6,
      );
      fanSprite.position.set(app.screen.width * 0.85, app.screen.height * 0.5);
    }
  };

  resizeAll(); // initial call

  // Listen for window resize to adjust both sprites dynamically
  window.addEventListener("resize", () => {
    resizeBackground();
    resizeTutorialContainer();
    resizeAll(); // initial call
  });

  resizeAll(); // initial call
  resetInactivityTimer();
};

// Wait for MRAID before initializing Pixi
MraidHelper.instance.waitForReady(() => {
  MraidHelper.instance.applySizeToContainer();
  startPixiApp();
});
