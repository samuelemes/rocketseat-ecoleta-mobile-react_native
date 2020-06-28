import React, { useState, useEffect } from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, KeyboardAvoidingView, Platform, Picker, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

    interface IBGEUFResponse {
    sigla: string;
    }

    interface IBGECityResponse {
    nome: string;
    }

    interface IPAddressResponse {
        ipAddress: string;
    }

    const Home = () => {
   

    const navigation = useNavigation();
    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');
    const [ ufs, setUfs ] = useState<string[]>([]);
    const [ cities, setCities ] = useState<string[]>([]);
   
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
          const ufInitials = response.data.map( uf => uf.sigla);
          setUfs(ufInitials);
        });
      }, []);
      
      useEffect(() => {
        if(uf === '0'){
          return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
          .then(response => {
            const cityNames = response.data.map( city => city.nome);
            setCities(cityNames);
        });
      }, [uf]);

        function handleNavigationToPoints(){
            if(uf === '0' || uf === '')
                Alert.alert('Oooops...', 'Informe a UF!');
            else if(city === '')
                Alert.alert('Oooops...', 'Informe a Cidade!');
            else
            navigation.navigate('Points', { uf, city });
        }

        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
                <View>
                    <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                    <Text style={styles.description}>Ajudamos pessoas a entrarem pontos de coleta de forma eficiente.</Text>
                </View>
                </View>
        
                <View style={styles.footer}>
                <View style={styles.input}>
                    <Picker
                    style={styles.picker}
                    selectedValue={uf}
                    onValueChange={(itemValue) => {
                        setCities([]); 
                        setCity(''); 
                        setUf(itemValue)
                    }}
                    >
                    <Picker.Item key="0" label="Selecione uma UF" value="0" />
                    {ufs.map(
                        uf => (
                        <Picker.Item key={uf} label={uf} value={uf} />
                        )
                    )}
                    </Picker>
                </View>
                
                <View style={styles.input}>
                    <Picker
                    style={styles.picker}
                    selectedValue={city}
                    onValueChange={(itemValue) => setCity(itemValue)}
                    >
                    <Picker.Item key="0" label="Selecione uma Cidade" value="0" />
                    {cities.map(
                        city => (
                        <Picker.Item key={city} label={city} value={city} />
                        )
                    )}
                    </Picker>
                </View>
        
                <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                    <View style={styles.buttonIcon}>
                    <Text>
                        <Icon name="arrow-right" color="#FFF" size={24} />
                    </Text>
                    </View>
                    <Text style={styles.buttonText}>
                    Entrar
                    </Text>
                </RectButton>
                </View>
            </ImageBackground>
            </KeyboardAvoidingView>
        )
        };


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      backgroundColor: '#f0f0f5',
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
    
    picker: {
      height: 60,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });
  
  export default Home;