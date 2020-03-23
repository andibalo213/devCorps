import React, { Fragment } from 'react'
import spinner from './spinner.gif'

export default () => {

    return (
        <Fragment>
            <img src={spinner} style={{ display: "block", width: '200px', margin: 'auto' }} alt="...loading" />
        </Fragment>
    )
}