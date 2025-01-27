### README.md

# Color Generator

Generate random colors and pick colors from images and color palettes. This project was created to practice DOM manipulation, inspired by the "100 DOM Projects" course by Stack Learner, mentored by [@mrhm-dev](https://github.com/mrhm-dev) (HM Nayem).

## Features added by me

- Dark and light mode toggle
- Drag and drop images to pick colors
- Color picker button from color palette
- Eyedropper for picking colors from the palette image on mouseover
- Alert toast message for invalid hex code input
- RGB sliders with corresponding colors
- Alert sound for alert toast
- Delete individual color boxes from the custom color preset palette

## Demo

Check out the live demo [here](https://generate-color-and-pick.netlify.app/).

## Installation

To run this project locally, clone the repository and install the required dependencies using npm.

```bash
git clone https://github.com/abdussamadarefi/color-generator.git
cd color-generator
```

## Usage

1. Toggle between dark and light mode using the switch at the top.
2. Drag and drop an image to pick colors from it.
3. Use the color picker button to select a color from the palette.
4. Adjust colors using the RGB sliders.
5. Save or copy the current color.
6. Add colors to the custom preset palette and delete them as needed.

## File Structure

- **index.html** - Contains the HTML structure of the project.
- **app.js** - Contains the JavaScript functionality for the project.
- **style.css** - Contains the CSS styles for the project.

## HTML Structure

The `index.html` file includes several sections:
- Display Color Section: Allows toggling between dark and light modes and generating random colors.
- Color Picker Section: Enables users to pick colors from an image or a color palette.
- Change & Copy Color Section: Allows users to save and copy colors, and adjust colors using RGB sliders.
- Color Preset Section: Displays preset colors that can be copied to the clipboard.
- Custom Color Preset Section: Allows users to save and delete custom colors.

## JavaScript Functionality

The `app.js` file includes:
- Event listeners for various user interactions such as color generation, hex input, RGB sliders, copy to clipboard, and image upload.
- Functions to handle color generation, input validation, DOM updates, and custom color palette management.
- Utilities for converting between different color formats (hex, RGB).

## CSS Styles

The `style.css` file includes:
- Base styles for the project.
- Styles for dark mode and light mode.
- Styles for various UI components such as buttons, sliders, color palettes, and toast messages.

## Contributing

If you have any ideas or suggestions, feel free to open an issue or submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).
