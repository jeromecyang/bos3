"use es6";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    axios
      .get(
        "https://spreadsheets.google.com/feeds/list/1PPCcW1XVljZ1n4plGoyYj44ciCMwklnBkeHayg0uQFE/1/public/values?alt=json"
      )
      .then(function(response) {
        const {
          data: {
            feed: { entry }
          }
        } = response;
        console.log(entry);
      });
  }

  render() {
    return <div>Lifetime Sojourner</div>;
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
