import {Platform, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Text, Card} from '@ui-kitten/components';
import {useDispatch, useSelector} from 'react-redux';
import {selectMessage} from '../store/selectors';
import {MessageVariant} from '../../../types';
import {putMessage} from '../store/actions';

const MessageIndicator = () => {
  const appMessage = useSelector(selectMessage);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<MessageVariant>('info');
  const timeoutRef = useRef<number>();
  useEffect(() => {
    if (appMessage) {
      setMessage(
        typeof appMessage === 'string' ? appMessage : appMessage.message,
      );
      setVariant(typeof appMessage === 'string' ? 'info' : appMessage.type);
      timeoutRef.current = setTimeout(() => {
        dispatch(putMessage(''));
      }, 3000);
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appMessage]);
  if (appMessage) {
    return (
      <View style={styles.messageIndicator}>
        <Card style={styles.card} status={variant}>
          <Text>{message}</Text>
        </Card>
      </View>
    );
  }
  return <></>;
};

export default MessageIndicator;

const styles = StyleSheet.create({
  messageIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 0,
    left: 0,
    height: 100,
    width: '100%',
    zIndex: 9999,
  },
  card: {
    flex: 1,
  },
});
