'use strict'

import React, {
  StyleSheet,
  Component,
  PropTypes,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native'

import Animatable from 'react-native-animatable'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
})

export default class AnimatableOverlay extends Component {

  static propTypes = {
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    backgroundColor: PropTypes.string,
    activeOpacity: PropTypes.number,
    visible: PropTypes.bool,
    hideAnimation: PropTypes.object,
    showAnimation: PropTypes.object,
    statusBarAutoHidden: PropTypes.bool,
    animateWithContent: PropTypes.bool,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    activeOpacity: 1,
    visible: false,
    statusBarAutoHidden: true,
    animateWithContent: true,
  }

  state = {
    animating: false,
    visible: false,
  }

  shounldComponentUpdate() {
    return this.state.animating ? false : true
  }

  handlePress = () => {
    let { onPress } = this.props
    if (typeof onPress === 'function') {
      onPress()
    }
  }

  handleAnimationBegin = () => {
    this.setState({
      animating: true,
    })
  }

  handleAnimationEnd = () => {

    let {
      visible,
      statusBarAutoHidden,
    } = this.props

    if (visible) {
      if (statusBarAutoHidden) {
        this.statusBarHidden = true
        StatusBar.setHidden(true)
      }
    }
    else {
      if (this.statusBarHidden) {
        this.statusBarHidden = false
        StatusBar.setHidden(false)
      }
    }

    this.setState({
      visible,
      animating: false,
    })

  }

  render() {

    let {
      top,
      right,
      bottom,
      left,
      children,
      backgroundColor,
      activeOpacity,
      visible,
      showAnimation,
      hideAnimation,
      animateWithContent,
    } = this.props

    if (!visible
      && !this.state.visible
    ) {
      return <View />
    }

    let animation = visible
      ? showAnimation
      : hideAnimation

    if (animation) {
      animation = {
        ...animation,
        animation: animation.name,
      }
    }

    if (animateWithContent) {
      return (
        <Animatable.View
          {...animation}
          style={[styles.container, {backgroundColor, top, right, bottom, left}]}
          onAnimationBegin={this.handleAnimationBegin}
          onAnimationEnd={this.handleAnimationEnd}
        >
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={this.handlePress}
            style={styles.container}
          />
          {children}
        </Animatable.View>
      )
    }

    return (
      <View style={[styles.container, {top, right, bottom, left}]}>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={this.handlePress}
          style={styles.container}
        >
          <Animatable.View
            {...animation}
            style={[styles.container, {backgroundColor}]}
            onAnimationBegin={this.handleAnimationBegin}
            onAnimationEnd={this.handleAnimationEnd}
          />
        </TouchableOpacity>
        {children}
      </View>
    )

  }

}
