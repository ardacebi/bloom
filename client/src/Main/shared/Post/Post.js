import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import {CachedImage} from 'react-native-cached-image';
import moment from 'moment';

import FontAwesome from '../../../shared/FontAwesome/FontAwesome';
import likePost from './api/likePost';

const translateDate = (date) => {
  date = date.replace('a few seconds ago', 'şimdi');
  date = date.replace('seconds ago', ' sn');

  date = date.replace('a minute ago', '1 dk');
  date = date.replace('minutes ago', 'dk');

  date = date.replace('an hour ago', '1 sa');
  date = date.replace('hours ago', 'sa');

  date = date.replace('a day ago', '1 gün');
  date = date.replace('days ago', 'gün');

  date = date.replace('a month ago', '1 ay');
  date = date.replace('months ago', 'ay');

  date = date.replace('a year ago', '1 yıl');
  date = date.replace('years ago', 'yıl');

  return date;
}

export default class Post extends Component {
  state = {
    liked: this.props.liked,
    likes: this.props.likes,
    disabled: false
  }

  like = () => {
    this.setState({disabled: true}, () => {
      likePost(
        this.props.jwt, 
        this.props.id,
        this.state.liked,
        (err, res) => {
          if (err && !res) {
            if (err === 'unauthenticated') return this.props.goHome();
            return Alert.alert(err);
          }
  
          this.setState({
            liked: res.liked,
            likes: res.likes,
            disabled: false
          });
        }
      );
    });
  }

  render() {
    return (
      <View style={styles.post}>
        {this.props.include.includes('user') && (
          <View style={styles.top}>
            {
              this.props.anonymous ? 
              (
                <TouchableOpacity 
                  style={styles.authorContainer}
                  onPress={() => {}}
                >
                  <CachedImage 
                    style={styles.profilepicture}
                    source={require('../../../images/defaultprofile.png')}
                  />
                  <Text style={styles.author}>Anonim</Text>
                </TouchableOpacity>
              ) :
              (
                <TouchableOpacity 
                  style={styles.authorContainer}
                  onPress={() => this.props.changePage('Profile', {user: this.props.author.id})}
                >
                  <CachedImage 
                    style={styles.profilepicture}
                    source={this.props.author.profilepicture ? 
                      {uri: 'https://www.bloomapp.tk/uploads/profilepictures/' + this.props.author.profilepicture} : 
                      require('../../../images/defaultprofile.png')
                    }
                  />
                  <Text style={styles.author}>{this.props.author.firstName} {this.props.author.lastName}</Text>
                </TouchableOpacity>
              ) 
            }
            <View style={styles.dateContainer}>
              <Text style={styles.date}>{translateDate(moment(this.props.date).fromNow())}</Text>
            </View>
          </View>
        )}
        <View style={styles.main}>
          {this.props.include.includes('topic') && (
            <TouchableOpacity 
              style={styles.topicContainer}
              onPress={() => this.props.changePage('Topic', this.props.topic)}
            >
              <Text style={styles.topic}>{this.props.topic}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity 
            style={styles.likesContainer}
            onPress={this.like}
            disabled={this.state.disabled}
          >
            <FontAwesome 
              style={this.state.liked ? styles.likeIconActive : styles.likeIconInactive}
              icon="heart"
            />
            <Text style={styles.likes}>{this.state.likes.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 1
  },
  top: {
    width: '100%',
    padding: 15,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    backgroundColor: '#fcfcfc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottom: {
    width: '100%',
    padding: 15,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    backgroundColor: '#fcfcfc',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  main: {
    width: '100%',
    padding: 15
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profilepicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  author: {
    fontWeight: '700',
    color: '#505050'
  },
  topic: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 5,
    color: 'rgba(0, 0, 0, 0.75)'
  },
  text: {
    fontWeight: '100'
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  likeIconActive: {
    color: '#EA3546',
    marginRight: 5
  },
  likeIconInactive: {
    color: '#CBD5DE',
    marginRight: 5
  },
  likes: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontWeight: '100'
  },
  date: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '300',
    fontSize: 12
  }
});