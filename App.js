import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage'
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react';
import { Header, Input, Icon, Button, ListItem } from 'react-native-elements';

export default function App() {

  const [food, setFood] = useState('')
  const [amount, setAmount] = useState('')
  const [list, setList] = useState([])

  const db = SQLite.openDatabase('shoppinglist.db')

  useEffect(() => {
    console.log('Luotu')
    db.transaction(tx => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, food text, amount text);')
    }, null, update
    )
  }, [])

  const saveIt = () => {
    console.log("Tallennus: ", amount, food)
    db.transaction(
      tx => {
        tx.executeSql('insert into shopping (food, amount) values (?, ?);', [food, amount])
      }, null, update
    )
  }

  const update = () => {
    console.log("Paivitys")
    console.log(list)
    db.transaction(
      tx => {
        tx.executeSql('select * from shopping;', [], (_, { rows }) => {
          setList(rows._array);
          setFood('');
          setAmount('');
          Keyboard.dismiss();
        })
      })
  }

  const deleteIt = (id) => {
    console.log("Poistaa")
    db.transaction(
      tx => {
        tx.executeSql('delete from shopping where id = ?;', [id]);
      },
      null, update
    )
  }

  const renderItem = ({ item }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{item.food}</ListItem.Title>
                <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>

                <View>
                <Icon 
                  onPress={(() => deleteIt(item.id))}
                  name='remove'
                  size={35}
                  color='blue'
                  />
                </View>
                
                
                
              </ListItem.Content>
            </ListItem>
          )

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Ostoslista', style: { color: 'white', 
          fontSize: 20, margin: 20, fontWeight: 'bold' } }}
      />
      
        <Input
          label='TUOTE'
          placeholder='Tuote'
          onChangeText={text => setFood(text)}
          value={food}
          fontSize={20}

          leftIcon={
            <Icon
              name='add'
              size={25}
              color='blue'
            />
          }
        />

        <Input
          label='MAARA'
          placeholder='Maara'
          onChangeText={text => setAmount(text)}
          value={amount}
          fontSize={15}

          leftIcon={
            <Icon
              name='add'
              size={20}
              color='blue'
            />
          }
        />
      

      
        <Button
          buttonStyle={{ width: 130, margin: 15 }}
          title='Tallenna'
          onPress={saveIt}
          
          icon={
            <Icon
              name='save'
              size={30}
              color='blue'
            />
          }
        />
      

      
        <FlatList
          ListHeaderComponent={() => <Text style={styles.table}>Lista</Text>}
          keyExtractor={(item, index) => index.toString()}
          data={list}
          renderItem={renderItem}
        />
      

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    width: 300,
    borderWidth:3,
    padding:10,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  table: {
    fontSize: 30, 
    fontWeight: "bold", 
    width:400,
  },
  row: {
    alignItems: 'center'
  },
  button: {
    margin: 5,
  },
});
