import React, { Component } from "react";
import {Helmet} from 'react-helmet'

export default class Seo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render()
  {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>Goodusdata data platform</title>
        <meta name="description" content="goodusdata" />
        <link rel="canonical" href="http://172.41.41.182:3000" />
      </Helmet>
    )
  }
}

