import React from 'react';
import { DrawerActions } from 'react-navigation';
import { NetInfo } from 'react-native';
import PropTypes from 'prop-types';
import { getMemberDataAsync } from '../utils/storageApi';
import { PROFILEPAGE } from '../utils/environment';
import {
  NoInternetView,
  ProfileView,
  ProfileViewLoader,
} from '../layout/Profile_view';

class Profile extends React.Component {
  state = {
    memberRequestCompleted: false,
    isConnected: 0,
  };
  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );
    this.populateMemberData();
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectionChange,
    );
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ isConnected: isConnected ? 1 : -1 });
  };

  populateMemberData = async () => {
    const member = await getMemberDataAsync();
    if (!member.valid) console.error('Member Data Invalid Error');
    this.setState({
      member,
      memberRequestCompleted: true,
    });
  };

  nav = (nav) => nav.dispatch.bind(DrawerActions.openDrawer());

  profileUrl = () =>
    `${PROFILEPAGE}?api=1&u=${this.state.member.id}&p=${
      this.state.member.token
    }`;

  render({ navigation } = this.props) {
    if (this.state.isConnected === 0 || !this.state.memberRequestCompleted) {
      return <ProfileViewLoader navigationAction={this.nav(navigation)} />;
    }
    if (this.state.isConnected === 1 && this.state.memberRequestCompleted) {
      return (
        <ProfileView
          sourceURL={this.profileUrl}
          navigationAction={this.nav(navigation)}
        />
      );
    }
    return <NoInternetView />;
  }
}

Profile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Profile;
