//
//  KBZPayManager.h
//  SlodonApp
//
//  Created by snow on 2020/1/5.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


NS_ASSUME_NONNULL_BEGIN

@interface KBZPayModule : RCTEventEmitter <RCTBridgeModule>

@property (nonatomic, copy) void (^payCall)(NSString *type);


@end

NS_ASSUME_NONNULL_END
