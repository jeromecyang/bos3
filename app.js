"use es6";

const head = (
  <div>
    <h1>Lifetime Sojourner</h1>
    <div>
      <b>
        {`travel through everyday life as a sojourner // curious, passionate and adventureous // jerome yang 楊佳榮`}
      </b>
    </div>
    <div>
      taiwanese // blogger // traveler // software engineer at{" "}
      <a href="https://www.hubspot.com/" target="_blank">
        hubspot
      </a>{" "}
      // member of{" "}
      <a href="https://mosaicboston.com/" target="_blank">
        mosaic boston church
      </a>
    </div>
    <div className="flex">
      <div>
        <i class="fa fa-instagram" />{" "}
        <a href="https://www.instagram.com/lifetimesojourner/" target="_blank">
          lifetimesojourner
        </a>
      </div>
      <div>
        <i class="fa fa-facebook-square" />{" "}
        <a href="https://www.facebook.com/lifetimesojourner/" target="_blank">
          lifetimesojourner
        </a>{" "}
        <a href="https://www.facebook.com/jerome.c.yang/" target="_blank">
          jerome.c.yang
        </a>
      </div>
      <div>
        <i class="fa fa-twitter-square" />{" "}
        <a href="https://twitter.com/jeromyang/" target="_blank">
          jeromyang
        </a>
      </div>
      <div>
        <i class="fa fa-linkedin-square" />{" "}
        <a href="https://www.linkedin.com/in/jeromecyang/" target="_blank">
          jeromecyang
        </a>
      </div>
      <div>
        <i class="fa fa-envelope-square" />{" "}
        <a href="mailto:hi@jeromeyang.com" target="_blank">
          hi@jeromeyang.com
        </a>
      </div>
    </div>
  </div>
);

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

class VisItem extends React.Component {
  render() {
    const { title, url, description } = this.props.item;
    return (
      <div className="m-10">
        <img src={url} />
        <div>{title}</div>
      </div>
    );
  }
}

class MediaItem extends React.Component {
  render() {
    const { title, event, url } = this.props.item;
    return (
      <div>
        <a href={url} target="_blank">
          {`${title} @ ${event}`}
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
    this.state = {
      items: [],
      categories: [],
      subcategories: [],
      visItems: [],
      mediaItems: []
    };
  }

  componentDidMount() {
    axios
      .all([1, 2, 3, 4, 5].map(getUrl).map(axios.get))
      .then(responses => responses.map(transform))
      .then(([items, categories, subcategories, visItems, mediaItems]) =>
        this.setState({
          items,
          categories,
          subcategories,
          visItems,
          mediaItems
        })
      );
  }

  renderItems(filterFunc) {
    return this.state.items
      .filter(filterFunc)
      .map(item => <Item item={item} />);
  }

  render() {
    const { categories, subcategories, visItems, mediaItems } = this.state;
    return (
      <div>
        {head}
        <h2>{`{UI · UX · Visualization}`}</h2>
        <div className="flex">{visItems.map(visItem => (
          <VisItem item={visItem} />
        ))}</div>
        <h4>{`- On Media -`}</h4>
        {mediaItems.map(mediaItem => (
          <MediaItem item={mediaItem} />
        ))}
        <h2>{`{Travel · Writing}`}</h2>
        {categories.map(category => {
          const thisSubcategories = subcategories
            .filter(subcategory => subcategory.category === category.token)
            .map(subcategory => subcategory.token);
          return (
            <div>
              <h3>{`[${category.title}]`}</h3>
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
                    <h4>{`- ${subcategory.title} -`}</h4>
                    {this.renderItems(
                      item =>
                        item.category === category.token &&
                        item.subcategory === subcategory.token
                    )}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
