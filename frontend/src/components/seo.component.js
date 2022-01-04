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
        <title>GOODSUSDATA - ROCKET HAMMER</title>
        <meta name="keywords" content="Rockethammer, Goodusdata, Kafka, Data Platform" />
        <meta name="description" content="GOODSUSDATA - ROCKET HAMMER" />
        <link rel="canonical" href="http://10.20.19.62:3000" />
      </Helmet>
    )
  }
}

