import React, { Component } from 'react';
import { AutoSizer } from 'react-virtualized';

import GoogleApiHOC from '../../common/utils/GoogleApiHOC';
import HeatMap from './HeatMap';

const GOOGLE_API_KEY = 'AIzaSyAcYLFCr4zVtYoPvNiQyxtmUtdlXasabVY';

@GoogleApiHOC({
 apiKey: GOOGLE_API_KEY,
 libraries: ['places', 'visualization', 'geometry'],
})
export default class Container extends Component {
  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    };

    return (
      <div style={style}>
        { !this.props.loaded
          ? <div>Loading...</div>
          : <AutoSizer>
            {({ height, width }) => (
              <HeatMap
                width={width}
                height={height}
                google={this.props.google}
              />
            )}
            </AutoSizer>
        }
      </div>
    );
  }
}