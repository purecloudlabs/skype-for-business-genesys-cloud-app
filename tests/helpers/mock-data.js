import moment from "moment";
import Ember from 'ember';
import RSVP from 'rsvp';

export const mockUser =
    ({
         name = 'Test McTesterson',
         skypePhotoUrl = '1',
         presence = 'Available',
         presenceClass = 'available'
     } = {}) =>
        Ember.Object.create({
            name: RSVP.resolve(name),
            skypePhotoUrl: RSVP.resolve(skypePhotoUrl),
            presence,
            presenceClass
        });

export const mockMessage =
    ({
         sender = mockUser(),
         timestamp = moment(),
         unread = true,
         text = "test message please ignore"
     } = {}) =>
        Ember.Object.create({
            sender,
            timestamp,
            unread,
            text
        });
