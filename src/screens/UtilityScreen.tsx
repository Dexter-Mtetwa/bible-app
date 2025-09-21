import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { localStore } from '../storage/localStore';
import { formatVerseReference } from '../utils/verseUtils';
import { Bookmark, HistoryItem, Note, Highlight } from '../storage/localStore';

const { width } = Dimensions.get('window');

export default function UtilityScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history' | 'notes' | 'highlights'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'bookmarks':
          const bookmarkData = await localStore.getBookmarks();
          setBookmarks(bookmarkData);
          break;
        case 'history':
          const historyData = await localStore.getHistory();
          setHistory(historyData);
          break;
        case 'notes':
          const noteData = await localStore.getNotes();
          setNotes(noteData);
          break;
        case 'highlights':
          const highlightData = await localStore.getHighlights();
          setHighlights(highlightData);
          break;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tab: 'bookmarks' | 'history' | 'notes' | 'highlights') => {
    setActiveTab(tab);
    const tabIndex = ['bookmarks', 'history', 'notes', 'highlights'].indexOf(tab);
    Animated.timing(tabIndicatorAnim, {
      toValue: tabIndex,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleItemPress = (item: Bookmark | HistoryItem) => {
    // Navigate to verse detail
    const verse = {
      id: 0, // This would need to be fetched from the database
      book: 0,
      chapter: item.chapter,
      verse: item.verse,
      text: item.text,
      book_name: item.bookName,
    };
    
    navigation.navigate('Bible', {
      screen: 'VerseDetail',
      params: { verse },
    });
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      await localStore.removeBookmark(bookmarkId);
      await loadData();
      Alert.alert('Success', 'Bookmark removed!');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      Alert.alert('Error', 'Failed to remove bookmark');
    }
  };

  const handleRemoveNote = async (noteId: string) => {
    try {
      await localStore.removeNote(noteId);
      await loadData();
      Alert.alert('Success', 'Note removed!');
    } catch (error) {
      console.error('Failed to remove note:', error);
      Alert.alert('Error', 'Failed to remove note');
    }
  };

  const handleRemoveHighlight = async (highlightId: string) => {
    try {
      await localStore.removeHighlight(highlightId);
      await loadData();
      Alert.alert('Success', 'Highlight removed!');
    } catch (error) {
      console.error('Failed to remove highlight:', error);
      Alert.alert('Error', 'Failed to remove highlight');
    }
  };

  const renderBookmarkItem = ({ item, index }: { item: Bookmark; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }
        ]
      }}
    >
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.itemGradient}
        >
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Ionicons name="bookmark" size={20} color="#3498db" />
              <Text style={styles.itemTitle}>{item.bookName} {item.chapter}:{item.verse}</Text>
            </View>
            <Text style={styles.itemText} numberOfLines={2}>{item.text}</Text>
            <Text style={styles.itemDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveBookmark(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHistoryItem = ({ item, index }: { item: HistoryItem; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }
        ]
      }}
    >
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.itemGradient}
        >
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Ionicons name="time" size={20} color="#e74c3c" />
              <Text style={styles.itemTitle}>{item.bookName} {item.chapter}:{item.verse}</Text>
            </View>
            <Text style={styles.itemText} numberOfLines={2}>{item.text}</Text>
            <Text style={styles.itemDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderNoteItem = ({ item, index }: { item: Note; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }
        ]
      }}
    >
      <View style={styles.itemContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.itemGradient}
        >
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Ionicons name="create" size={20} color="#f39c12" />
              <Text style={styles.itemTitle}>Note</Text>
            </View>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.itemDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveNote(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderHighlightItem = ({ item, index }: { item: Highlight; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }
        ]
      }}
    >
      <View style={styles.itemContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.itemGradient}
        >
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Ionicons name="bookmark" size={20} color="#FFD700" />
              <Text style={styles.itemTitle}>Highlight</Text>
            </View>
            <Text style={styles.itemText}>Verse ID: {item.verseId}</Text>
            <Text style={styles.itemDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveHighlight(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    const getEmptyMessage = () => {
      switch (activeTab) {
        case 'bookmarks':
          return 'No bookmarks yet';
        case 'history':
          return 'No reading history';
        case 'notes':
          return 'No notes yet';
        case 'highlights':
          return 'No highlights yet';
        default:
          return 'No items';
      }
    };

    const getData = () => {
      switch (activeTab) {
        case 'bookmarks':
          return bookmarks;
        case 'history':
          return history;
        case 'notes':
          return notes;
        case 'highlights':
          return highlights;
        default:
          return [];
      }
    };

    const getRenderItem = () => {
      switch (activeTab) {
        case 'bookmarks':
          return renderBookmarkItem;
        case 'history':
          return renderHistoryItem;
        case 'notes':
          return renderNoteItem;
        case 'highlights':
          return renderHighlightItem;
        default:
          return () => null;
      }
    };

    const data = getData();
    
    if (data.length === 0) {
      return (
        <Animated.View 
          style={[
            styles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Ionicons 
            name={activeTab === 'bookmarks' ? 'bookmark-outline' : 
                  activeTab === 'history' ? 'time-outline' :
                  activeTab === 'notes' ? 'create-outline' : 'bookmark-outline'} 
            size={64} 
            color="rgba(255, 255, 255, 0.5)" 
          />
          <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View 
        style={[
          styles.listContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <FlatList
          data={data}
          renderItem={getRenderItem()}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
            style={styles.headerGradient}
          >
            <Ionicons name="bookmark" size={28} color="#667eea" />
            <Text style={styles.title}>My Bible</Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.tabContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
            style={styles.tabBarGradient}
          >
            <TouchableOpacity
              style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]}
              onPress={() => handleTabSwitch('bookmarks')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={activeTab === 'bookmarks' ? 'bookmark' : 'bookmark-outline'} 
                size={20} 
                color={activeTab === 'bookmarks' ? '#3498db' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>
                Bookmarks
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'history' && styles.activeTab]}
              onPress={() => handleTabSwitch('history')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={activeTab === 'history' ? 'time' : 'time-outline'} 
                size={20} 
                color={activeTab === 'history' ? '#e74c3c' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                History
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
              onPress={() => handleTabSwitch('notes')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={activeTab === 'notes' ? 'create' : 'create-outline'} 
                size={20} 
                color={activeTab === 'notes' ? '#f39c12' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
                Notes
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'highlights' && styles.activeTab]}
              onPress={() => handleTabSwitch('highlights')}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={activeTab === 'highlights' ? 'bookmark' : 'bookmark-outline'} 
                size={20} 
                color={activeTab === 'highlights' ? '#FFD700' : '#666'} 
              />
              <Text style={[styles.tabText, activeTab === 'highlights' && styles.activeTabText]}>
                Highlights
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {renderContent()}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  tabBarGradient: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  itemGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
