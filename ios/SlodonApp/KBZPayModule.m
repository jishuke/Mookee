//
//  KBZPayManager.m
//  SlodonApp
//
//  Created by snow on 2020/1/5.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "KBZPayModule.h"

#import <KBZPayAPPPay/KBZPayAPPPay.h>

@implementation KBZPayModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startPay:(NSString *)orderInfo signType:(NSString *)signType sign:(NSString *)sign appScheme:(NSString *)appScheme){
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(kbzPayEventReminderReceived:) name:@"KBZ_PAY" object:nil];
  dispatch_async(dispatch_get_main_queue(), ^{
    [[PaymentViewController new] startPayWithOrderInfo:orderInfo signType:signType sign:sign appScheme:appScheme];
  });
};

- (NSArray<NSString *> *)supportedEvents{
  return @[@"kbzPayCallback"];
}

- (void)kbzPayEventReminderReceived:(NSNotification *)notification{
  NSString *code = notification.userInfo[@"EXTRA_RESULT"];
  [self sendEventWithName:@"kbzPayCallback" body:@{@"code": code}];
}

@end
