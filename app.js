"use es6";

const getUrl = tabId =>
  `https://spreadsheets.google.com/feeds/list/1PPCcW1XVljZ1n4plGoyYj44ciCMwklnBkeHayg0uQFE/${tabId}/public/values?alt=json`;

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

const transform = ({
  data: {
    feed: { entry }
  }
}) =>
  entry.map(e =>
    Object.keys(e).reduce(
      (collect, key) =>
        key.includes("gsx$")
          ? { ...collect, [key.replace("gsx$", "")]: e[key].$t }
          : collect,
      {}
    )
  );

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], categories: [], subcategories: [] };
  }

  componentDidMount() {
    axios
      .all([1, 2, 3].map(getUrl).map(axios.get))
      .then(responses => responses.map(transform))
      .then(([items, categories, subcategories]) =>
        this.setState({ items, categories, subcategories })
      );
  }

  renderItems(filterFunc) {
    return this.state.items
      .filter(filterFunc)
      .map(item => <Item item={item} />);
  }

  render() {
    const { categories, subcategories } = this.state;
    return (
      <div>
        <h1>Lifetime Sojourner</h1>
        <div>
          {`travel through everyday life as a sojourner // curious, passionate and adventureous // jerome yang's website`}
        </div>
        {categories.map(category => {
          const thisSubcategories = subcategories
            .filter(subcategory => subcategory.category === category.token)
            .map(subcategory => subcategory.token);
          return (
            <p>
              <h2>{`[${category.title}]`}</h2>
              {this.renderItems(
                item =>
                  item.category === category.token &&
                  !thisSubcategories.includes(item.subcategory)
              )}
              {subcategories
                .filter(subcategory =>
                  thisSubcategories.includes(subcategory.token)
                )
                .map(subcategory => (
                  <div>
                    <h3>{`- ${subcategory.title} -`}</h3>
                    {this.renderItems(
                      item =>
                        item.category === category.token &&
                        item.subcategory === subcategory.token
                    )}
                  </div>
                ))}
            </p>
          );
        })}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
