// ES6 Component
// Import React
require('react')
// Search component created as a class
class Search extends React.Component {

// render method is most important
// render method returns JSX template
    render() {
    return (
            <form>
                <input type="text" />
                <input type="submit" />
            </form>
        );
    }
}

// Export for re-use
export default Search


document.getElementById('content').innerHTML = "<label>Test</label>";