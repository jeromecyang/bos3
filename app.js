"use es6";

class Item extends React.Component {
  render() {
    const { titlezh, urlzh } = this.props.item;
    return (
      <div>
        <a href={urlzh} target="_blank">
          {titlezh}
        </a>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  componentDidMount() {
    axios
      .get(
        "https://spreadsheets.google.com/feeds/list/1PPCcW1XVljZ1n4plGoyYj44ciCMwklnBkeHayg0uQFE/1/public/values?alt=json"
      )
      .then(
        function(response) {
          const {
            data: {
              feed: { entry }
            }
          } = response;
          const items = entry.map(e =>
            Object.keys(e).reduce(
              (collect, key) =>
                key.includes("gsx$")
                  ? { ...collect, [key.replace("gsx$", "")]: e[key].$t }
                  : collect,
              {}
            )
          );
          this.setState({ items });
        }.bind(this)
      );
  }

  render() {
    return (
      <div>
        <h1>Lifetime Sojourner</h1>
        {this.state.items.map(item => (
          <Item item={item} />
        ))}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
