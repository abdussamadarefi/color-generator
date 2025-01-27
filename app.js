/**
 * Date: 04-01-2025
 * Author: Abdus Samad Arefi
 * Description: Random color generator and color picker of random color.
 */


// Globals
let toastMessageContainer = null;
let toastTimeout = null;
let inputToastTimeout = null;
const defaultColor = {
    red:221,
    green:222,
    blue:238
}
const defaultColorPalette = [
    "#69D2E7",
    "#A7DBD8",
    "#E0E4CC",
    "#F38630",
    "#FA6900",
    "#FE4365",
    "#FC9D9A",
    "#F9CDAD",
    "#C8C8A9",
    "#83AF9B",
    "#ECD078",
    "#D95B43"
]

const audio = new Audio('./Audio/copy-sound.mp3')
const errorAudio = new Audio('./Audio/error_sound.mp3')
let customColors = new Array(24)
let alertShown = false

// Onload Handler
window.onload = () => {
    main()
    updateDomToColor(defaultColor)
    colorPalettes(document.getElementById('color-palettes'), defaultColorPalette, 'click to copy')
    const customColorsString = localStorage.getItem('custom-colors')
    if(customColorsString){
        customColors = JSON.parse(customColorsString)
        colorPalettes(document.getElementById('custom-color-palettes'), customColors, 'click to copy, double click to remove')
    } 
}

// Main or Boot function
/**
 * Initializes the main functionality of the Color Picker application.
 * Sets up DOM references and event listeners for various UI elements.
 * Handles color generation, input, and manipulation, including:
 * - Random color generation
 * - Hex color input
 * - RGB color sliders
 * - Copying colors to clipboard
 * - Saving and displaying custom color palettes
 * - Image color picking using EyeDropper API
 * - Drag-and-drop image upload
 * - Dark mode toggle
 */
function main() {

    // DOM references
    const randomColorGenerator = document.getElementById('random-color-generator')
    const hexInputBox = document.getElementById('hex-inputbox')
    const colorSliderRed = document.getElementById('slider-color-red')
    const colorSliderGreen = document.getElementById('slider-color-green')
    const colorSliderBlue = document.getElementById('slider-color-blue')
    const copyToClipboard = document.getElementById('copy-action-btn')
    const colorPalettesParent = document.getElementById('color-palettes')
    const saveCustomColors = document.getElementById('save-action-btn')
    const customColorsPalettes = document.getElementById('custom-color-palettes')
    const dropArea = document.getElementById('drop-area')
    const inputFile = document.getElementById('input-file')
    const colorPickerBtn = document.getElementById('color-picker-btn')
    const selectImgColor = document.getElementById('select-img-color')
    selectImgColor.style.display = 'none'
    const colorPickerImg = document.getElementById('color-picker-img')
    const toggleCheckbox = document.getElementById('toggle-checkbox')
    
    
    randomColorGenerator.addEventListener('click', randomColorHandler)
    hexInputBox.addEventListener('keyup', hexInputBoxHandler)
    colorSliderRed.addEventListener('change', colorSliderHandler(colorSliderRed, colorSliderGreen, colorSliderBlue))
    colorSliderGreen.addEventListener('change', colorSliderHandler(colorSliderRed, colorSliderGreen, colorSliderBlue))
    colorSliderBlue.addEventListener('change', colorSliderHandler(colorSliderRed, colorSliderGreen, colorSliderBlue))
    copyToClipboard.addEventListener('click', copyToClipboardHandler )
    colorPalettesParent.addEventListener('click', colorPalettesParentHandler)
    saveCustomColors.addEventListener('click', saveCustomColorsHandler)
    customColorsPalettes.addEventListener('click', colorPalettesParentHandler)
    customColorsPalettes.addEventListener('dblclick', customColorsPalettesHandler)
    inputFile.addEventListener('change', uploadImage)
    dropArea.addEventListener('dragover', function(e){
        e.preventDefault()

    })
    dropArea.addEventListener('drop', function(e){
        e.preventDefault()
        inputFile.files = e.dataTransfer.files
        uploadImage()

    })
    colorPickerBtn.addEventListener('change', function(e){
        const color = e.target.value
        hexColor = color.substring(1)
        
        if (hexColor) {
            if (isHexValid(hexColor)) {
                const hexToDecimal = hexToDecimalConvert(hexColor)
                updateDomToColor(hexToDecimal)
        }}
        
    })
    selectImgColor.addEventListener('click', function(){
        if('EyeDropper' in window){
            const eyeDropper = new EyeDropper()
        eyeDropper.open()
                  .then((res)=>{
                    const color = res.sRGBHex
                    const hexToDecimal = hexToDecimalConvert(color.substring(1))
                    updateDomToColor(hexToDecimal)
                  })
                    .catch((e)=>{
                        console.log(e);
                    })
                }else{
                    alert('EyeDropper is not supported in your browser, Please use Chrome or Edge')
                }        
    })

    colorPickerImg.addEventListener('mouseover', function(event){
        if('EyeDropper' in window){
            const eyeDropper = new EyeDropper()
            eyeDropper.open()
                      .then((res)=>{
                        const color = res.sRGBHex
                        const hexToDecimal = hexToDecimalConvert(color.substring(1))
                        updateDomToColor(hexToDecimal)
                      })
                        .catch((e)=>{
                            console.log(e);
                        })
                    }else{
                        if(!alertShown){
                            alert("EyeDropper is not supported in your browser, Please use Chrome or Edge")
                            alertShown = true
                        }
                        
                    }
                    
    })
    toggleCheckbox.addEventListener('change',function(){
        document.body.classList.toggle('dark')

    })







/**
 * main function end here
 */
}



// Event Handling Functions

function randomColorHandler() {
    const color = decimalGenerator()
    updateDomToColor(color)
}

function hexInputBoxHandler(e) {
    if (e.target) {
        const hexColor = e.target.value
        if (hexColor) {
            this.value = hexColor.toUpperCase()
            if (isHexValid(hexColor)) {
                const hexToDecimal = hexToDecimalConvert(hexColor)
                updateDomToColor(hexToDecimal)
            }else{
                if (toastMessageContainer !== null) {
                    toastMessageContainer.remove()
                    toastMessageContainer = null;
                }
                if(hexColor.length >= 6 ){
                    if (inputToastTimeout) {
                        clearTimeout(inputToastTimeout);
                        inputToastTimeout = null;
                    }
                    toastMessage(`${hexColor.substring(6)} is Not Valid Color`,'red')
                    errorAudio.volume = 0.1
                    errorAudio.play()
                    inputToastTimeout = setTimeout(()=>{
                        toastMessageContainer.remove()
                    },5000)
                }else{
                    if (toastMessageContainer !== null) {
                        toastMessageContainer.remove()
                        toastMessageContainer = null;
                    }
                }
            }
        }
    }
}


function colorSliderHandler(colorSliderRed, colorSliderGreen, colorSliderBlue) {

    return function () {
        const color = {
            red: parseInt(colorSliderRed.value),
            green: parseInt(colorSliderGreen.value),
            blue: parseInt(colorSliderBlue.value)

        }
        updateDomToColor(color)
    }
}

function copyToClipboardHandler() {
    const colorMode = document.getElementsByName('color-mode')
    const mode = getCheckedColorMode(colorMode)
    if (mode === null) {
        throw new Error('Invalid Color Mode')
    }
    if (toastMessageContainer !== null) {
        toastMessageContainer.remove()
        toastMessageContainer = null;
    }
    if (toastTimeout) {
        clearTimeout(toastTimeout);
        toastTimeout = null;
    }
    
    if (mode === 'hex') {
        const hexColor = document.getElementById('hex-inputbox').value
        if (hexColor && isHexValid(hexColor)) {
            navigator.clipboard.writeText(`#${hexColor}`)
            audio.volume = 0.1 
            audio.play()
            toastMessage(`#${hexColor} is Copied`)
        }
        else {
            alert('Invalid Hex Color Code')
        }
    } else {
        const rgbColor = document.getElementById('rgb-inputbox').value
        if (rgbColor) {
            navigator.clipboard.writeText(rgbColor)
            audio.volume = 0.3 
            audio.play()
            toastMessage(`${rgbColor} is Copied`)
        }
        else{
            alert('Invalid RGB Color Code')
        }
    }
    if(toastMessageContainer){
        toastTimeout = setTimeout(()=>{
        toastMessageContainer.remove()
        toastMessageContainer = null;
        },5000)
    }

}
function colorPalettesParentHandler(event){

    if (toastMessageContainer !== null) {
        toastMessageContainer.remove()
        toastMessageContainer = null;
    }
    if (toastTimeout) {
        clearTimeout(toastTimeout);
        toastTimeout = null;
    }

    const boxColor = event.target
    if(boxColor.className === 'color-palette'){
        navigator.clipboard.writeText(boxColor.getAttribute('data-color'))
        audio.volume = 0.1
        audio.play()
        toastMessage(`${boxColor.getAttribute('data-color')} is Copied`)
    }
    if(toastMessageContainer){
        toastTimeout = setTimeout(()=>{
        toastMessageContainer.remove()
        toastMessageContainer = null;
        },5000)
    }
    
}
function saveCustomColorsHandler(){
    const customColorsPalettes = document.getElementById('custom-color-palettes')
    const colorValue = `#${document.getElementById('hex-inputbox').value}`
    if(customColors.includes(colorValue)){
        alert('Color Already Exist')
        return;
    }
    customColors.unshift(colorValue)
    if(customColors.length > 24){
        customColors = customColors.slice(0,24)
    }
    audio.volume = 0.1 
    audio.play()
    localStorage.setItem('custom-colors',JSON.stringify(customColors))
    removeChildren(customColorsPalettes)
    colorPalettes(customColorsPalettes,customColors, 'click to copy, double click to remove')
}
function uploadImage(){
    const inputFile = document.getElementById('input-file')
    const imageView = document.getElementById('image-view')
    const selectImgColor = document.getElementById('select-img-color')
    let imLink = URL.createObjectURL(inputFile.files[0])
    imageView.style.backgroundImage = `url(${imLink})`
    imageView.textContent = ''
    imageView.style.border = 0
    selectImgColor.style.display = 'block'
 }
function customColorsPalettesHandler(event){
    const targetedBox  = event.target
    const customColorsPalettes = document.getElementById('custom-color-palettes')
    if(targetedBox.className === 'color-palette' && customColors.includes(targetedBox.getAttribute('data-color'))){
        const index = customColors.indexOf(targetedBox.getAttribute('data-color'))
        customColors.splice(index,1)
        localStorage.setItem('custom-colors',JSON.stringify(customColors))
        removeChildren(customColorsPalettes)
        colorPalettes(customColorsPalettes,customColors, 'click to copy, double click to remove') 
    }
}





// DOM Functions
/**
 * update DOM with generated values
 */
function updateDomToColor(color) {
    const hexColor = hexColorGenerator(color).toUpperCase()
    const rgbColor = rgbColorGenerator(color)
    
    document.getElementById('color-display').style.backgroundColor = `#${hexColor}`
    document.getElementById('hex-inputbox').value = hexColor
    document.getElementById('rgb-inputbox').value = rgbColor
    document.getElementById('slider-color-red').value = color.red
    document.getElementById('slider-color-red-label').innerText = color.red
    document.getElementById('slider-color-green').value = color.green
    document.getElementById('slider-color-green-label').innerText = color.green
    document.getElementById('slider-color-blue').value = color.blue
    document.getElementById('slider-color-blue-label').innerText = color.blue
}
/**
 * 
 * @param {array} nodes 
 * @returns {string | null}
 */
function getCheckedColorMode(nodes) {
    let checkedValue = null;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedValue = nodes[i].value
            break;
        }
    }
    return checkedValue
}




/**
 * creating div for showing a toast message after copying color code
 * @param {string} msg 
 */
function toastMessage(msg, bgColor) {
    toastMessageContainer = document.createElement('div')
    toastMessageContainer.innerText = msg
    toastMessageContainer.style.backgroundColor = bgColor || 'green'
    toastMessageContainer.className = 'toast-message animation-slide-in'

    toastMessageContainer.addEventListener('click', function () {
        toastMessageContainer.classList.remove('animation-slide-in')
        toastMessageContainer.classList.add('animation-slide-out')

        toastMessageContainer.addEventListener('animationend', function () {
            toastMessageContainer.remove()
            toastMessageContainer = null;
        })

    })

    document.body.appendChild(toastMessageContainer)
}
/**
 * 
 * @param {Array} color 
 * @returns {object | null}
 */
function generateColorPalette(color, title){
    const div = document.createElement('div')
    div.style.backgroundColor = color
    div.className = 'color-palette'
    div.setAttribute('data-color', color)
    div.title  = title || ''

    return div
}
/**
 * 
 * @param {object} parent 
 * @param {Array} color 
 */
function colorPalettes(parent, colors, title){
    colors.forEach((color)=>{
        if(isHexValid(color.slice(1))){
            const colorBox = generateColorPalette(color, title)
            parent.appendChild(colorBox)
        }
    })
}

function removeChildren(parent){
    let child = parent.lastElementChild;  
        while (child) { 
            parent.removeChild(child); 
            child = parent.lastElementChild; 
        } 
}

// Utils

/**
 * generating decimal number for color code
 * @param {object} 
 * 
 */
function decimalGenerator() {
    let red = Math.floor(Math.random() * 255)
    let green = Math.floor(Math.random() * 255)
    let blue = Math.floor(Math.random() * 255)

    return {
        red,
        green,
        blue
    }
}

/**
 * generating hex color code
 * @param {object} color 
 * @returns {string}
 */
function hexColorGenerator({ red, green, blue }) {
    const getTwoCode = (value) => {
        const hex = value.toString(16)
        return hex.length === 1 ? `0${hex}` : hex;
    }
    return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`
}

/**
 * generating rgb color code
 * @param {object} color
 * @returns {string}
 */
function rgbColorGenerator({ red, green, blue }) {
    return `rgb(${red},${green},${blue})`
}
/** 
 * converting hex color to rgb color code
 * @param {string} hex
 * @returns {object}
*/
function hexToDecimalConvert(hex) {
    const red = parseInt(hex.slice(0, 2), 16)
    const green = parseInt(hex.slice(2, 4), 16)
    const blue = parseInt(hex.slice(4), 16)
    return {
        red,
        green,
        blue
    }
}
/**
 * generating hex to rgb color code
 * @param {object} 
 * @returns {string}
 */
function hexToRgb({ red, green, blue }) {

    // returning rgb color code

    return `rgb(${red},${green},${blue})`
}
/**
* Validating hex color code
* @param {string} color
* 
*/

function isHexValid(color) {
    if (color.length !== 6) return false
    return /^[0-9A-Fa-f]{6}$/i
}