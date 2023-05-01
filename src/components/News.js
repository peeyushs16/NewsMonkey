import React, { Component } from 'react'
import NewsItem from './NewsItem'
import { Spinner } from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {

    static defaultProps = {
        country : 'in',
        pageSize : 8,
        category : 'general'
    };

    static propTypes = {
        country : PropTypes.string,
        pageSize : PropTypes.number,
        category : PropTypes.string

    };

    constructor(){
        super();

        this.state = {
            article : [],
            laoding : false,
            page : 1
        }
    }

    async updateNews(){
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=61d3210bd9214287a5d26cca956f220e&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({laoding:true});
        let articleList = await fetch(url);
        let partDate = await articleList.json();
        this.setState({
            article: partDate.articles,
            laoding : false ,
            page : this.state.page - 1
        });
    }

    async componentDidMount() {
        this.updateNews();
    }

    handlePrevClick = async () => {
        this.setState({page : this.state.page - 1});
        this.updateNews();
    }

    handleNextClick = async () => {
        this.setState({page : this.state.page + 1});
        this.updateNews();
    }

  render() {
    return (
        <>
            <div className="container my-3">
                <h2 className='text-center'>Newsmonkey - Top Headlines</h2>

                {this.state.laoding && <Spinner />}
                <div className="row my-3">
                    {!this.state.laoding && this.state.article.map((element)=>{
                        return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title.slice(0,72)} description={element.description!==null?element.description.slice(0,88):''} imageUrl={element.urlToImage} 
                            newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                        </div>
                    })}
                </div>

                <div className="container d-flex justify-content-between">
                    <button type="button" disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr; </button>
                </div>
            </div>
            
        </>
    )
  }
}

export default News