# Processor Execution Simulator

An interactive educational tool that simulates step-by-step execution of code in a processor, helping students and developers understand how computers execute programs at the lowest level.

## Features

- **Step-by-Step Execution**: Watch code execute one instruction at a time
- **Real-time Variable Tracking**: See how variables change in memory during execution
- **Multiple Examples**: Includes classic algorithms like loops, factorial, Fibonacci, and array operations
- **Visual Feedback**: Highlighted current line, executed lines, and processor state
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Use arrow keys for navigation, 'R' to reset

## Technologies Used

- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with Flexbox, Grid, and responsive design
- **Vanilla JavaScript**: ES6+ features, modular architecture with classes
- **No External Dependencies**: Pure web technologies for maximum compatibility

## Architecture

The application follows a modular architecture:

- `index.html`: Main HTML structure
- `styles.css`: Responsive styling with dark theme
- `script.js`: Simulator class handling UI interactions and state management
- `examples.js`: Data structure containing code examples and execution steps

## How It Works

1. Select an example from the dropdown
2. Click "NEXT" to execute one step at a time
3. Watch the current line highlight in the code panel
4. Observe variables update in the memory panel
5. See processor state and output in real-time
6. Use "PREV" to go back or "RESET" to start over

## Educational Value

This simulator helps understand:

- Program execution flow
- Variable scope and lifetime
- Memory management concepts
- Conditional statements and loops
- Function calls and returns
- Input/output operations

## Browser Support

Works in all modern browsers that support ES6+:

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Development

To run locally:

```bash
python3 -m http.server 8000
# Then open http://localhost:8000/index.html
```

## Contributing

Feel free to add more code examples or improve the UI/UX. The modular design makes it easy to extend.

## License

MIT License - feel free to use for educational purposes.
