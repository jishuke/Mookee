//
//  RNBridgeManager.m
//  SlodonApp
//
//  Created by Noah on 2020/4/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RNBridgeManager.h"

@implementation RNBridgeManager

RCT_EXPORT_MODULE(ToolModule);

RCT_EXPORT_METHOD(getAppVersion:(RCTResponseSenderBlock)callback)
{
  //获取项目版本号
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  callback(@[[NSNull null],version]);
}

@end
