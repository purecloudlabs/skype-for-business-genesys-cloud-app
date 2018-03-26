import moment from "moment";
import Ember from 'ember';
import RSVP from 'rsvp';

export const mockUser = () =>
    Ember.Object.create({
        name: RSVP.resolve('Test McTesterson'),
        skypePhotoUrl: RSVP.resolve('1'),
        presence: 'Available',
        presenceClass: 'available'
    });

export const mockMessage = (sender = mockUser()) =>
    Ember.Object.create({
        sender,
        timestamp: moment(),
        unread: true,
        text: "test message please ignore"
    });
