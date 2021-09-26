import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props) {
    super(props);
    console.log("constructor")
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }
  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1872bc59cbe14dc79dae75c1ab5ad5b1&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json()
    console.log("update news");
     this.setState({
       articles: parsedData.articles,
       totalResults: parsedData.totalResults,
       loading: false,
     })
  }
   async componentDidMount() {
     this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}& apiKey=1872bc59cbe14dc79dae75c1ab5ad5b1&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log("fetchmore")
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      
    });
  };

  render() {
    return (
      <>
        <h1 className="text-center">
          Top Headlines on {this.capitalizeFirstLetter(this.props.category)}  
          category
        </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
            {this.state.articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage? element.urlToImage:"https://static.toiimg.com/thumb/msid-86423140,width-1070,height-580,imgsize-40570,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg"} newsUrl={element.url} author={element.author ? element.author : ""} date={element.publishedAt} source={element.source}/>
                  </div>
                })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News;
