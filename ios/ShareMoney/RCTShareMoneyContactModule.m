//
//  RCTShareMoneyContactModule.m
//  ShareMoney
//
//  Created by Kosy Allison on 22/01/2023.
//

#import <Contacts/Contacts.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import "RCTShareMoneyContactModule.h"

@implementation RCTShareMoneyContactModule
 RCT_EXPORT_MODULE(ShareMoneyContactModule);


RCT_EXPORT_METHOD(loadContacts:(int) offset resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  CNContactStore *store = [[CNContactStore alloc] init];
  
  [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
      if (granted == YES) {
        NSMutableArray<NSDictionary *> *contacts = [[NSMutableArray alloc] init];
            //keys with fetching properties
            NSArray *keys = @[CNContactFamilyNameKey, CNContactGivenNameKey, CNContactPhoneNumbersKey, CNContactImageDataKey];
            NSString *containerId = store.defaultContainerIdentifier;
            NSPredicate *predicate = [CNContact predicateForContactsInContainerWithIdentifier:containerId];
            NSError *error;
            NSArray *cnContacts = [store unifiedContactsMatchingPredicate:predicate keysToFetch:keys error:&error];
            if (error) {
              NSString *errorMessage = [NSString stringWithFormat:@"error fetching contacts: %@", error];
              
                RCTLogInfo(errorMessage);
              reject(@"event_failure",errorMessage, nil);
              
            } else {
                for (CNContact *contact in cnContacts) {
                    // copy data to my custom Contacts class.
                  NSString *name = [NSString stringWithFormat:@"%@ %@", contact.givenName, contact.familyName];
                  NSMutableArray<NSString *> *numbers = [[NSMutableArray alloc] init];
                  for (CNLabeledValue *label in contact.phoneNumbers) {
                                     NSString *phone = [label.value stringValue];
                                     if ([phone length] > 0) {
                                         [numbers addObject:phone];
                                     }
                      }
                  
                  NSDictionary *c = @{
                    @"name": name,
                    @"phoneNumbers": numbers
                  };
                  
                  [contacts addObject:c];
                }
              resolve(contacts);
            }}
      else {
           reject(@"event_failure", @"Permission not granted", nil);
      }
  }];
}

RCT_EXPORT_METHOD(checkPermissions:(NSString *) name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    CNContactStore *store = [[CNContactStore alloc] init];
  [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
      if (granted == YES) {
        RCTLogInfo(@"Granted");
     
        resolve(@(true));
      }
      else {
        RCTLogInfo(@"Failed");
        resolve(@(false));
      }
  }];
}

@end
