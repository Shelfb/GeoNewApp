import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButtom from "../../components/CustomButton";
import FormField from "../../components/FormField";
import * as DocumentPicker from "expo-document-picker";
import { icons, images } from "../../constants";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if ((form.prompt === "") | (form.title === "")) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        prompt: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-blue-400 font-psemibold text-center">
          Give us your opinion
        </Text>

        <FormField
          title="How would you rate the place?"
          value={form.title}
          placeholder="In a range of 1 to 5"
          keyboardType="numeric"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
          className="border-blue-400"
        />

        <FormField
          title="How would you rate the chosen dish?"
          placeholder="In a range of 1 to 5"
          keyboardType="numeric"
          value={form.text}
          handleChangeText={(e) => setForm({ ...form, text: e })}
          otherStyles="mt-7"
        />

        <FormField
          title="How would you rate the service"
          placeholder="In a range of 1 to 5"
          keyboardType="numeric"
          value={form.text1}
          handleChangeText={(e) => setForm({ ...form, text1: e })}
          otherStyles="mt-7"
        />
        <FormField
          title="Would you recommend this place?"
          placeholder="Yes or No"
          value={form.text2}
          handleChangeText={(e) => setForm({ ...form, text2: e })}
          otherStyles="mt-7"
        />
        <CustomButtom
          title="Send"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
