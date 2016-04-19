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
    bottom: PropTypes.number,
    backgroundColor: PropTypes.string,
    activeOpacity: PropTypes.number,
    visible: PropTypes.bool,
    hideAnimation: PropTypes.object,
    showAnimation: PropTypes.object,
    statusBarAutoHidden: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    top: 0,
    bottom: 0,
    backgroundColor: '#000',
    activeOpacity: 1,
    visible: false,
  };

  state = {
    animating: false,
    visible: false,
  };

  shounldComponentUpdate() {
    return this.state.animating ? false : true
  }

  handlePress = () => {
    let { onPress } = this.props
    if (typeof onPress === 'function') {
      onPress()
    }
  }

  handleAnimationStart = () => {
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
      bottom,
      children,
      backgroundColor,
      activeOpacity,
      visible,
      showAnimation,
      hideAnimation,
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

    return (
      <TouchableOpacity
        style={[styles.container, {top, bottom}]}
        onPress={this.handlePress}
        activeOpacity={activeOpacity}
      >
        <Animatable.View
          ref="view"
          style={[styles.container, {backgroundColor}]}
          onAnimationStart={this.handleAnimationStart}
          onAnimationEnd={this.handleAnimationEnd}
          {...animation}
        >
          {children}
        </Animatable.View>
      </TouchableOpacity>
    )

  }

}
