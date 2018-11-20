import React, {Component} from 'react';
import {
  StyleSheet, 
  ScrollView,
  View,
  Text,
  Alert,
  RefreshControl
} from 'react-native';

import {CachedImage} from 'react-native-cached-image';

import Post from '../shared/Post/Post';

import getUser from '../shared/api/getUser.js';
export default class Profile extends Component {  
  state = {
    id: '',
    user: {},
    refreshing: false
  }

  loadUser = (state = {}) => {
    getUser(
      this.props.jwt, 
      (this.props.user === 'self' ? null : this.props.user), 
      (err, res) => {
      if (err && !res) {
        if (err === 'unauthenticated') return this.props.goHome();
        return Alert.alert(err);
      }
      this.setState({
        id: this.props.user,
        user: res.user,
        ...state
      });
    });
  }

  componentWillMount = this.loadUser;
  
  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadUser({refreshing: false});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
          style={styles.posts}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={styles.user}>
            <CachedImage 
              style={styles.profilepicture}
              source={this.state.user.profilepicture ? 
                {uri: 'https://www.bloomapp.tk/uploads/profilepictures/' + this.state.user.profilepicture} : 
                require('../../../src/images/defaultprofile.png')
              }
            />
            <Text style={styles.name}>{this.state.user.firstName} {this.state.user.lastName}</Text>
            <Text style={styles.school}>{this.state.user.school}</Text>
            {
              this.state.user.about && 
              <Text style={styles.about}>{this.state.user.about}</Text>  
            }
          </View>
          {Object.keys(this.state.user).length > 0 && this.state.user.posts.map((post, index) => (
            <Post 
              key={post.id}
              {...post}
              author={this.state.user}
              include={['user', 'topic']}
              jwt={this.props.jwt}
              changePage={this.props.changePage}
              goHome={this.props.goHome}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  posts: {
    padding: 15
  },
  user: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1,
    padding: 15,
    alignItems: 'center'
  },
  profilepicture: {
    width: 150,
    height: 150,
    marginBottom: 15,
    borderRadius: 75
  },
  name: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.75)'
  },
  school: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 15,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)'
  },
  about: {fontWeight: '400'},
  backButtonContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12.5
  },
  backButton: {
    width: 12.5,
    height: 12.5
  }
});