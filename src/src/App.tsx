import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Ticket,
  Music,
  Guitar,
  Piano,
  Mic,
  Zap,
  Heart,
  X,
  Clock,
  DollarSign,
  Users as UsersIcon,
  Star,
  Plus,
  Upload,
  Edit,
  Trash2,
  UserPlus,
  AlertCircle,
  User, // icon for "My events" filter toggle
} from 'lucide-react';
import { supabase, Event } from './lib/supabase';
import type { AuthError } from '@supabase/supabase-js';

const categories = [
  { id: 'all', name: 'All', icon: Music },
  { id: 'rock', name: 'Rock', icon: Guitar },
  { id: 'jazz', name: 'Jazz', icon: Piano },
  { id: 'indie', name: 'Indie', icon: Mic },
  { id: 'pop', name: 'Pop', icon: Heart },
  { id: 'electronic', name: 'Electronic', icon: Zap },
  { id: 'country', name: 'Country', icon: Music }
];

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    price_range: '',
    capacity: '',
    organizer: '',
    description: '',
    category: 'rock',
    image: null as File | null
  });
  const [editEvent, setEditEvent] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    price_range: '',
    capacity: '',
    organizer: '',
    description: '',
    category: 'rock',
    image: null as File | null
  });
  const [newEventImagePreview, setNewEventImagePreview] = useState<string | null>(null);
  const [editEventImagePreview, setEditEventImagePreview] = useState<string | null>(null);

  // COMMUNITY (Registration) modal state — includes password fields
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityForm, setCommunityForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  // Existing dedicated Join modal (kept)
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinForm, setJoinForm] = useState({ email: '', password: '', confirmPassword: '' });

  // Header toggle: show only my events
  const [showMineOnly, setShowMineOnly] = useState(false);

  useEffect(() => {
    fetchEvents();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInForm.email,
      password: signInForm.password,
    });

    if (error) {
      setAuthError((error as AuthError).message || 'Unable to sign in');
    } else {
      setUser(data.user);
      setShowSignInModal(false);
      setSignInForm({ email: '', password: '' });
    }
    setAuthLoading(false);
  };

  // Community modal performs real sign-up (email + password + confirm + username)
  const handleCommunitySignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (!communityForm.username.trim()) {
      setAuthError('Username is required');
      setAuthLoading(false);
      return;
    }
    if (!communityForm.email.trim()) {
      setAuthError('Email is required');
      setAuthLoading(false);
      return;
    }
    if (!communityForm.password) {
      setAuthError('Password is required');
      setAuthLoading(false);
      return;
    }
    if (communityForm.password !== communityForm.confirmPassword) {
      setAuthError('Passwords do not match');
      setAuthLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: communityForm.email,
      password: communityForm.password,
      options: {
        data: { username: communityForm.username }
      }
    });

    if (error) {
      setAuthError(error.message);
      setAuthLoading(false);
      return;
    }

    // Optional: Insert to profiles table here
    // await supabase.from('profiles').insert({ id: data.user?.id, username: communityForm.username });

    setShowCommunityModal(false);
    setCommunityForm({ username: '', email: '', password: '', confirmPassword: '' });

    if (data.user) setUser(data.user); // if email confirmation disabled

    setAuthLoading(false);
  };

  // Existing Join modal sign-up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (joinForm.password !== joinForm.confirmPassword) {
      setAuthError('Passwords do not match');
      setAuthLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: joinForm.email,
      password: joinForm.password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setUser(data.user);
      setShowJoinModal(false);
      setJoinForm({ email: '', password: '', confirmPassword: '' });
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowMineOnly(false);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event: any) => {
      const matchesSearch =
        (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.venue || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesMine =
        !showMineOnly || (user && event.user_id && event.user_id === user.id);
      return matchesSearch && matchesCategory && matchesMine;
    });
  }, [events, searchQuery, selectedCategory, showMineOnly, user]);

  const getTicketStatus = (event: Event & { available?: boolean; capacity?: number }): 'available' | 'soldout' | 'limited' => {
    // @ts-ignore - available may exist on your table
    if (!event.available) return 'soldout';
    if (event.capacity && event.capacity < 100) return 'limited';
    return 'available';
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-400';
      case 'soldout':
        return 'text-red-400';
      case 'limited':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTicketStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Tickets Available';
      case 'soldout':
        return 'Sold Out';
      case 'limited':
        return 'Limited Tickets';
      default:
        return 'Unknown';
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Guard: require user to create
      if (!user) {
        setShowSignInModal(true);
        setIsCreating(false);
        return;
      }

      let imageUrl = '';

      // Upload image if provided
      if (newEvent.image) {
        const fileExt = newEvent.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, newEvent.image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          const { data } = supabase.storage
            .from('event-images')
            .getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }

      // Create event in database
      const eventData: any = {
        title: newEvent.title,
        date: newEvent.date || null,
        time: newEvent.time || null,
        duration: newEvent.duration || null,
        venue: newEvent.venue || null,
        price_range: newEvent.price_range || null,
        capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null,
        organizer: newEvent.organizer || null,
        description: newEvent.description || null,
        category: newEvent.category,
        image: imageUrl || null,
        available: true,
        rating: 0.0,
        user_id: user.id, // track creator
      };

      const { error } = await supabase
        .from('events')
        .insert([eventData]);

      if (error) {
        console.error('Error creating event:', error);
      } else {
        // Reset form and close modal
        setNewEvent({
          title: '',
          date: '',
          time: '',
          duration: '',
          venue: '',
          price_range: '',
          capacity: '',
          organizer: '',
          description: '',
          category: 'rock',
          image: null
        });
        setNewEventImagePreview(null);
        setShowCreateModal(false);
        // Refresh events list
        fetchEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsEditing(true);

    try {
      let imageUrl = (selectedEvent as any).image;

      // Upload new image if provided
      if (editEvent.image) {
        const fileExt = editEvent.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, editEvent.image);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          const { data } = supabase.storage
            .from('event-images')
            .getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }

      // Update event in database
      const eventData: any = {
        title: editEvent.title,
        date: editEvent.date || null,
        time: editEvent.time || null,
        duration: editEvent.duration || null,
        venue: editEvent.venue || null,
        price_range: editEvent.price_range || null,
        capacity: editEvent.capacity ? parseInt(editEvent.capacity) : null,
        organizer: editEvent.organizer || null,
        description: editEvent.description || null,
        category: editEvent.category,
        image: imageUrl || null
      };

      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', (selectedEvent as any).id);

      if (error) {
        console.error('Error updating event:', error);
      } else {
        setShowEditModal(false);
        setEditEventImagePreview(null);
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', (selectedEvent as any).id);

      if (error) {
        console.error('Error deleting event:', error);
      } else {
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (event: Event) => {
    setEditEvent({
      title: event.title || '',
      date: (event as any).date || '',
      time: (event as any).time || '',
      duration: (event as any).duration || '',
      venue: (event as any).venue || '',
      price_range: (event as any).price_range || '',
      capacity: (event as any).capacity ? String((event as any).capacity) : '',
      organizer: (event as any).organizer || '',
      description: (event as any).description || '',
      category: (event as any).category || 'rock',
      image: null
    });
    setEditEventImagePreview((event as any).image);
    setShowEditModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewEvent({ ...newEvent, image: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewEventImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditEvent({ ...editEvent, image: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditEventImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    const [hours, minutes] = (timeString || '').split(':');
    const date = new Date();
    date.setHours(parseInt(hours || '0', 10), parseInt(minutes || '0', 10));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Helper to check ownership quickly
  const isOwner = (evt?: any) => {
    if (!user || !evt) return false;
    return evt.user_id === user.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              MUSIC EVENTS DISCOVERY
            </h1>
            
            {/* Right actions in header */}
            <div className="flex items-center space-x-2">
              {/* My events toggle (icon only) - visible when logged in */}
              {user && (
                <button
                  type="button"
                  onClick={() => setShowMineOnly(v => !v)}
                  title={showMineOnly ? 'Showing: My events' : 'Filter: My events'}
                  className={`p-2 rounded-lg transition-all duration-200 ring-1 ${
                    showMineOnly
                      ? 'bg-gray-800 ring-purple-500 text-white'
                      : 'bg-gray-900 ring-gray-700 text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <User className="h-4 w-4" />
                </button>
              )}

              {/* Join Community (hide when logged in) */}
              {!user && (
                <button
                  onClick={() => { setAuthError(''); setShowCommunityModal(true); }}
                  className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-600/25"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm font-medium">Join our Community</span>
                </button>
              )}
              
              {/* Sign In / Welcome */}
              <button
                onClick={() => {
                  if (!user) {
                    setAuthError('');
                    setShowSignInModal(true);
                  }
                }}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {user ? `Welcome, ${user.email}` : 'Sign In'}
              </button>

              {/* Sign Out (red button) */}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="relative ml-4 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400 w-48 sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event: any) => {
            const ticketStatus = getTicketStatus(event);
            return (
              <div
                key={event.id}
                className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105 group"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={event.title || 'Event'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                
                {/* Event Details */}
                <div className="p-4 relative">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors duration-200">
                    {event.title || 'Untitled Event'}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {event.description || 'No description available'}
                  </p>
                  
                  {/* Ticket Status */}
                  <div className="flex items-center mb-2">
                    <Ticket className="h-4 w-4 mr-2 text-purple-400" />
                    <span className={`text-sm font-medium ${getTicketStatusColor(ticketStatus)}`}>
                      {getTicketStatusText(ticketStatus)}
                    </span>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-300 text-sm">{event.venue || 'TBD'}</span>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center mb-4">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-300 text-sm">{formatDate(event.date)}</span>
                  </div>

                  {/* Go to Details Button */}
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg hover:shadow-purple-600/25"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No events found</div>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {/* Floating Add Button (disabled if not logged in) */}
      <button
        onClick={() => (user ? setShowCreateModal(true) : setShowSignInModal(true))}
        disabled={!user}
        className={`fixed bottom-6 right-6 p-4 rounded-full transition-all duration-300 hover:scale-110 z-40 shadow-2xl ${
          user
            ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-600/50'
            : 'bg-gray-700 text-gray-300 cursor-not-allowed'
        }`}
        title={user ? 'Add New Event' : 'Sign in to add events'}
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <img
                src={(selectedEvent as any).image || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={(selectedEvent as any).title || 'Event'}
                className="w-full h-40 object-cover rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Edit and Delete Buttons (only if owner) */}
              {user && isOwner(selectedEvent as any) && (
                <div className="absolute top-4 right-16 flex space-x-2">
                  <button
                    onClick={() => openEditModal(selectedEvent)}
                    className="bg-blue-600/80 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200"
                    title="Edit Event"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDeleteEvent}
                    disabled={isDeleting}
                    className="bg-red-600/80 hover:bg-red-700 disabled:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
                    title="Delete Event"
                  >
                    {isDeleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
              
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-2xl font-bold text-white mb-1">{(selectedEvent as any).title || 'Untitled Event'}</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white font-medium">{(selectedEvent as any).rating || 'N/A'}</span>
                  </div>
                  <span className={`text-sm font-medium ${getTicketStatusColor(getTicketStatus(selectedEvent as any))}`}>
                    {getTicketStatusText(getTicketStatus(selectedEvent as any))}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">About this event</h3>
                <p className="text-gray-300 leading-relaxed">
                  {(selectedEvent as any).description || 'No description available for this event.'}
                </p>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">Date & Time</span>
                  </div>
                  <p className="text-gray-300">{formatDate((selectedEvent as any).date)}</p>
                  {(selectedEvent as any).time && (
                    <p className="text-gray-300 text-sm">{formatTime((selectedEvent as any).time)}</p>
                  )}
                </div>

                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">Duration</span>
                  </div>
                  <p className="text-gray-300">{(selectedEvent as any).duration || 'TBD'}</p>
                </div>

                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">Venue</span>
                  </div>
                  <p className="text-gray-300">{(selectedEvent as any).venue || 'TBD'}</p>
                </div>

                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">Price Range</span>
                  </div>
                  <p className="text-gray-300">{(selectedEvent as any).price_range || 'TBD'}</p>
                </div>

                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <UsersIcon className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">Capacity</span>
                  </div>
                  <p className="text-gray-300">
                    {(selectedEvent as any).capacity ? `${(selectedEvent as any).capacity.toLocaleString()} people` : 'TBD'}
                  </p>
                </div>

                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Music className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">Organizer</span>
                  </div>
                  <p className="text-gray-300">{(selectedEvent as any).organizer || 'TBD'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Create New Event</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter event title"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>

              {/* Duration and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="e.g., 2 hours"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-white font-medium mb-2">Venue</label>
                <input
                  type="text"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter venue name"
                />
              </div>

              {/* Price Range and Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Price Range</label>
                  <input
                    type="text"
                    value={newEvent.price_range}
                    onChange={(e) => setNewEvent({ ...newEvent, price_range: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="e.g., $25-$50"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Capacity</label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Maximum attendees"
                  />
                </div>
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-white font-medium mb-2">Organizer</label>
                <input
                  type="text"
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Event organizer name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400 resize-none"
                  placeholder="Describe your event..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white font-medium mb-2">Event Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-300">
                      {newEvent.image ? newEvent.image.name : 'Choose image file'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newEvent.title}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-purple-600/25"
                >
                  {isCreating ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Edit Event</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleEditEvent} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white font-medium mb-2">Event Title *</label>
                <input
                  type="text"
                  required
                  value={editEvent.title}
                  onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter event title"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={editEvent.date}
                    onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Time</label>
                  <input
                    type="time"
                    value={editEvent.time}
                    onChange={(e) => setEditEvent({ ...editEvent, time: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>

              {/* Duration and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={editEvent.duration}
                    onChange={(e) => setEditEvent({ ...editEvent, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="e.g., 2 hours"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    value={editEvent.category}
                    onChange={(e) => setEditEvent({ ...editEvent, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                  >
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-white font-medium mb-2">Venue</label>
                <input
                  type="text"
                  value={editEvent.venue}
                  onChange={(e) => setEditEvent({ ...editEvent, venue: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter venue name"
                />
              </div>

              {/* Price Range and Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Price Range</label>
                  <input
                    type="text"
                    value={editEvent.price_range}
                    onChange={(e) => setEditEvent({ ...editEvent, price_range: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="e.g., $25-$50"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Capacity</label>
                  <input
                    type="number"
                    value={editEvent.capacity}
                    onChange={(e) => setEditEvent({ ...editEvent, capacity: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                    placeholder="Maximum attendees"
                  />
                </div>
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-white font-medium mb-2">Organizer</label>
                <input
                  type="text"
                  value={editEvent.organizer}
                  onChange={(e) => setEditEvent({ ...editEvent, organizer: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Event organizer name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  rows={3}
                  value={editEvent.description}
                  onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400 resize-none"
                  placeholder="Describe your event..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white font-medium mb-2">Event Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="hidden"
                    id="edit-image-upload"
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className="flex items-center justify-center w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                  >
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-300">
                      {editEvent.image ? editEvent.image.name : 'Choose new image (optional)'}
                    </span>
                  </label>
                </div>
                {(selectedEvent as any).image && !editEvent.image && !editEventImagePreview && (
                  <p className="text-sm text-gray-400 mt-1">Current image will be kept if no new image is selected</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing || !editEvent.title}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-blue-600/25"
                >
                  {isEditing ? 'Updating...' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Community Modal (REGISTRATION) */}
      {showCommunityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white">Join our Community</h2>
                <p className="text-gray-400 text-sm mt-1">Create your account</p>
              </div>
              <button
                onClick={() => setShowCommunityModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleCommunitySignUp} className="p-6 space-y-4">
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{authError}</span>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-white font-medium mb-2">Username *</label>
                <input
                  type="text"
                  required
                  value={communityForm.username}
                  onChange={(e) => setCommunityForm({ ...communityForm, username: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Choose your username"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={communityForm.email}
                  onChange={(e) => setCommunityForm({ ...communityForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-medium mb-2">Password *</label>
                <input
                  type="password"
                  required
                  value={communityForm.password}
                  onChange={(e) => setCommunityForm({ ...communityForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Create a password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white font-medium mb-2">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={communityForm.confirmPassword}
                  onChange={(e) => setCommunityForm({ ...communityForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Benefits Section */}
              <div className="bg-gray-800/50 rounded-lg p-4 mt-2">
                <h3 className="text-white font-medium mb-3">Community Benefits</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Connect with other music enthusiasts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Get early access to tickets
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Share your favorite events
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCommunityModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    authLoading ||
                    !communityForm.username ||
                    !communityForm.email ||
                    !communityForm.password ||
                    !communityForm.confirmPassword
                  }
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-600/25"
                >
                  {authLoading ? 'Creating Account...' : 'Join Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white">Sign In</h2>
                <p className="text-gray-400 text-sm mt-1">Welcome back to Music Events</p>
              </div>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSignIn} className="p-6 space-y-4">
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{authError}</span>
                </div>
              )}
              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-medium mb-2">Password *</label>
                <input
                  type="password"
                  required
                  value={signInForm.password}
                  onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSignInModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authLoading || !signInForm.email || !signInForm.password}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-purple-600/25"
                >
                  {authLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignInModal(false);
                      setAuthError('');
                      setShowJoinModal(true);
                    }}
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Modal (existing alternative sign-up) */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white">Join Our Community</h2>
                <p className="text-gray-400 text-sm mt-1">Create your account</p>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSignUp} className="p-6 space-y-4">
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{authError}</span>
                </div>
              )}
              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={joinForm.email}
                  onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-medium mb-2">Password *</label>
                <input
                  type="password"
                  required
                  value={joinForm.password}
                  onChange={(e) => setJoinForm({ ...joinForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Create a password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white font-medium mb-2">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={joinForm.confirmPassword}
                  onChange={(e) => setJoinForm({ ...joinForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-purple-600/25"
                >
                  {authLoading ? 'Creating Account...' : 'Join Community'}
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setShowJoinModal(false);
                      setAuthError('');
                      setShowSignInModal(true);
                    }}
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
