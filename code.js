
// 1) Listen for user to select layer (node) with solid fills
// 2) Calculate contrast between selected layers
// 3) Send results and selection to UI
// 4) Update the UI


figma.showUI(__html__, {width: 360, height: 420}) // function to show the plugin's UI
 
// Normalised global variables for foreground & background colors

let foregroundColor
let foregroundAlpha
let backgroundColor
let backgroundAlpha


// Converts RGB values to Hex values

function convertRgbToHex(color) {
    const hex = color
      .map(col => {
        const hexColor = col.toString(16)
        return `0${hexColor}`.slice(-2)
      })
      .join('')
    return `#${hex}`
  }


// Calculates luminance based on WCAG definition of relative luminance

function calculateLuminance(color) {
    const normalizedColor = color.map(channel => channel / 255)
    const gammaCorrectedRGB = normalizedColor.map(channel =>
      channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4)
    )
    const luminance =
      gammaCorrectedRGB[0] * 0.2126 +
      gammaCorrectedRGB[1] * 0.7152 +
      gammaCorrectedRGB[2] * 0.0722
    return luminance
  }

// Normalises RGB values to more common 0-255 range

function getRGB({ r, g, b }) {
    const rgbColorArray = [r, g, b].map(channel => Math.round(channel * 255))
    return rgbColorArray
  }
  
  function overlay(foreground, alpha, background) {
    if (alpha >= 1) {
      return foreground
    }
    const overlaid = foreground.map((channel, i) =>
      Math.round(channel * alpha + background[i] * (1 - alpha))
    )
    return overlaid
  }
  

// Gets contrast scores based on WCAG 2.0 guidelines. 

function getContrastScores(contrast) {
    let largeText
    let normalText
    let Gui
    switch (true) {
      case contrast > 7:
        largeText = 'AAA'
        normalText = 'AAA'
        Gui = 'AAA'
        break
      case contrast > 4.5:
        largeText = 'AAA'
        normalText = 'AA'
        Gui = 'AA'
        break
      case contrast > 3:
        largeText = 'AA'
        normalText = 'FAIL'
        Gui = 'FAIL'
        break
      default:
        largeText = 'FAIL'
        normalText = 'FAIL'
        Gui = 'FAIL'
        break
    }
    return { largeText, normalText, Gui }
  }


// Sends converted color results to the UI

function sendContrastInfo(contrast, foreground, background) {
    figma.ui.postMessage({ // sends to <iframe> so we can show the user the results.
      type: 'selectionChange',
      foreground: convertRgbToHex(foreground),
      background: convertRgbToHex(background),
      contrast,
      scores: getContrastScores(contrast),
    })
  }


// Checking if colors have opacities 

function calculateAndSendContrast(foreground, alpha, background) {
    if (alpha < 1) {
      foreground = overlay(foreground, alpha, background)
    }
    const foregroundLuminance = calculateLuminance(foreground) + 0.05
    const backgroundLuminance = calculateLuminance(background) + 0.05
    let contrast = foregroundLuminance / backgroundLuminance
    if (backgroundLuminance > foregroundLuminance) {
      contrast = 1 / contrast
    }
    contrast = Math.floor(contrast * 100) / 100
    return sendContrastInfo(contrast, foreground, background)
  }
  

// 1. Listening for selections by users with built in selection change listener on the figma instance

figma.on('selectionchange', () => {
    if (figma.currentPage.selection.length > 1) { // This returns an array of the currently selected elements
      const selection = figma.currentPage.selection.filter(
        node => node.fills.length > 0 && node.fills[0].type === 'SOLID'
      )
      const fills = selection.map(node => node.fills[0])
      foregroundColor = getRGB(fills[0].color)
      foregroundAlpha = fills[0].opacity
      backgroundColor = getRGB(fills[1].color)
      backgroundAlpha = fills[1].opacity
      calculateAndSendContrast(foregroundColor, foregroundAlpha, backgroundColor)
    }
    console.log('Please select at least 2 layers')
  })

// receives the message in the plugin code

  figma.ui.onmessage = msg => { 
    if (msg.type === 'swap') {
      if (figma.currentPage.selection.length > 1) {
        ;[foregroundColor, backgroundColor, foregroundAlpha, backgroundAlpha] = [
          backgroundColor,
          foregroundColor,
          backgroundAlpha,
          foregroundAlpha,
        ]
        calculateAndSendContrast(foregroundColor, foregroundAlpha, backgroundColor)
      }
    }
  }

  