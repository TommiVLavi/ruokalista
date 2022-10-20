import { StatusBar } from 'expo-status-bar';
import { Alert, Button, FlatList, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage'
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react';

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

  return (
    <View style={styles.container}>

      <View>
        <TextInput
          style={styles.input}
          placeholder='Tuote'
          onChangeText={text => setFood(text)}
          value={food}
        />

        <TextInput
          style={styles.input}
          placeholder='Maara'
          onChangeText={text => setAmount(text)}
          value={amount}
        />
      </View>

      <View style={styles.button}>
        <Button
          title='Tallenna'
          onPress={saveIt}
        />
      </View>

      <View style={styles.table}>
        <FlatList
          ListHeaderComponent={() => <Text style={{fontSize: 20, fontWeight: "bold"}}>Lista</Text>}
          keyExtractor={(item) => String(item.id)}
          data={list}
          renderItem={({ item }) =>
            <View style={styles.row}>
              <Text>{`${item.food} ${item.amount}`}</Text>
              <Text style={styles.link} onPress={(() => deleteIt(item.id))}>Saatu</Text>
            </View> 
          }
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '70%',
    alignItems: 'center',
    margin: 40,
  },
  row: {
    margin: 10,
  },
  link: {
    color: 'blue',
    fontWeight: 'bold'
  },
  button: {
    margin: 5,
  }
});
