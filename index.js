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
    style: View.propTypes.style,
    activeOpacity: PropTypes.number,
    visible: PropTypes.bool,
    hideAnimation: PropTypes.object,
    showAnimation: PropTypes.object,
    statusBarAutoHidden: PropTypes.bool,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
  }

  static defaultProps = {
    activeOpacity: 1,
    visible: false,
    statusBarAutoHidden: true,
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

  handleLongPress = () => {
    let { onLongPress } = this.props
    if (typeof onLongPress === 'function') {
      onLongPress()
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
      children,
      activeOpacity,
      visible,
      style,
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
      <Animatable.View
        {...animation}
        style={[styles.container, style]}
        onAnimationBegin={this.handleAnimationBegin}
        onAnimationEnd={this.handleAnimationEnd}
      >
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={this.handlePress}
          onLongPress={this.handleLongPress}
          style={styles.container}
        />
        {children}
      </Animatable.View>
    )

  }

}
