import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchData();
    loadFavorites();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://reqres.in/api/users?page=2");
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error(error);
    }

  };

  const loadFavorites = async () => {
    try {
      const value = await AsyncStorage.getItem("favorites");
      if (value !== null) {
        setFavorites(JSON.parse(value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async (userId) => {
    const index = favorites.indexOf(userId);
    let updatedFavorites = [...favorites];
    if (index === -1) {
      updatedFavorites.push(userId);
    } else {
      updatedFavorites.splice(index, 1);
    }
    setFavorites(updatedFavorites);
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.includes(item.id);
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#e7e7e7",
        }}
      >
        <Text>
          {item.first_name} {item.last_name}
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Text
            style={{
              marginLeft: 10,
              color: isFavorite ? "white" : "black",
              backgroundColor: "lightpink",
              borderRadius: 5,
             
            }}
          >
            {isFavorite ? "UnFavorite" : "Favorite"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: 50, backgroundColor: "#e7e7e7" }}>
      <Text
        style={{
          marginHorizontal: 10,
          fontSize: 15,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        List of Users
      </Text>
      <FlatList data={users} renderItem={renderItem} />
      <Text
        style={{
          marginHorizontal: 10,
          fontSize: 15,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Favorite Users:
      </Text>
      <FlatList
        data={users.filter((user) => favorites.includes(user.id))}
        renderItem={renderItem}
      />
    </View>
  );
};

export default App;
