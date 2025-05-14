import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderWithSearch from '../../../../lib/components/HeaderWithSearch';
import TicketList from './RenderList';

const Tickets = () => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => {}} />
      }
      style={styles.container}>
      {/* <HeaderWithSearch/> */}
      <TicketList />
    </ScrollView>
  );
};

export default Tickets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
