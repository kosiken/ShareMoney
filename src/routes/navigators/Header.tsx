/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  Icon,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {Platform, SafeAreaViewComponent} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackHeaderProps} from '@react-navigation/stack';
import Box from '../../design-system/components/Box';

const Header: React.FC<StackHeaderProps> = props => {
  const insets = useSafeAreaInsets();

  const onGoBack = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    }
  };
  const BackIcon = (props2: any) => (
    <Box flex={false} row middle>
      <Icon
        {...props2}
        name={Platform.OS === 'android' ? 'arrow-back' : 'chevron-left-outline'}
      />
      <Box flex={false} margin={[0, 4]} />
      {props.back && Platform.OS === 'ios' && (
        // eslint-disable-next-line react-native/no-inline-styles
        <Text style={{fontSize: 14}}>{props.back.title}</Text>
      )}
      <Box flex={false} margin={[0, 5]} />
    </Box>
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={onGoBack} />
  );

  return (
    <SafeAreaViewComponent>
      <TopNavigation
        style={{marginTop: 20, paddingTop: 1000}}
        accessoryLeft={BackAction}
        title={props.route.name + 'jjj'}
      />
    </SafeAreaViewComponent>
  );
};

export default Header;
