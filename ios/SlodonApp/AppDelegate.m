/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <AMapFoundationKit/AMapFoundationKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
//#import "AlipayModule.h"
#import "RNSplashScreen.h"
#import "Orientation.h"
//#import <RCTJPushModule.h>

#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <UMShare/UMShare.h>
#import "RNUMConfigure.h"

//三方的key
//极光推送
#define JPUSH_KEY @"4b1124ede2ac348d82043dc7"
//友盟
#define UM_APPKEY @"5dfc832b570df38d700002f1"
//微信key
#define WX_APPKEY @"wx4de4ad3e29a14d52"
//微信appSecret
#define WX_APPSECRET @"f164e63252eec90f07a0ea3a9b47906b"
//facebook
#define FB_APPKEY @"793464561074367"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // JPush初始化配置
//  [JPUSHService setupWithOption:launchOptions appKey:JPUSH_KEY channel:@"dev" apsForProduction:YES];
  // APNS
//  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
//  entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
//  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
//  [launchOptions objectForKey: UIApplicationLaunchOptionsRemoteNotificationKey];
  // 自定义消息
//  NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
//  [defaultCenter addObserver:self selector:@selector(networkDidReceiveMessage:) name:kJPFNetworkDidReceiveMessageNotification object:nil];
  // 地理围栏
//  [JPUSHService registerLbsGeofenceDelegate:self withLaunchOptions:launchOptions];

  
  NSURL *jsCodeLocation;
  
    #ifdef DEBUG
//        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  jsCodeLocation = [NSURL URLWithString:@"http://192.168.10.193:8081/index.bundle?platform=ios&dev=true"];
    #else
        jsCodeLocation = [CodePush bundleURL];
    #endif
  
  //友盟
  [UMConfigure setLogEnabled:YES];
  [RNUMConfigure initWithAppkey:UM_APPKEY channel:@"App Store"];
  
  [self configUShareSettings];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SlodonApp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  return YES;
}

- (NSString *)getParamByName:(NSString *)name URLString:(NSString *)url
{
    NSError *error;
    NSString *regTags=[[NSString alloc] initWithFormat:@"(^|&|\\?)+%@=+([^&]*)(&|$)", name];
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:regTags
                                                                           options:NSRegularExpressionCaseInsensitive
                                                                             error:&error];
    
    // 执行匹配的过程
    NSArray *matches = [regex matchesInString:url
                                      options:0
                                        range:NSMakeRange(0, [url length])];
    for (NSTextCheckingResult *match in matches) {
        NSString *tagValue = [url substringWithRange:[match rangeAtIndex:2]];  // 分组2所对应的串
        return tagValue;
    }
    return @"";
}

- (void)configUShareSettings
{
  [[UMSocialManager defaultManager] openLog:YES];
  
  //微信
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession appKey:WX_APPKEY appSecret:WX_APPSECRET redirectURL:nil];
  
  //facebook
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Facebook appKey:FB_APPKEY appSecret:nil redirectURL:nil];
  
  /* 谷歌+ */
//  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_GooglePlus appKey:@"852592958398-ps41cl4aur3ohlnsird9or6qkeo8nb0t.apps.googleusercontent.com"  appSecret:nil redirectURL:nil];
  
  
  
  /* 设置Twitter的appKey和appSecret */
//  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Twitter appKey:@"fB5tvRpna1CKK97xZUslbxiet"  appSecret:@"YcbSvseLIwZ4hZg9YmgJPP5uWzd4zr6BpBKGZhf07zzh3oj62K" redirectURL:nil];
  
  
  
  //关闭强制验证https，可允许http图片分享
  [UMSocialGlobal shareInstance].isUsingHttpsWhenShareContent = NO;
  
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options{
//  [AlipayModule handleCallback:url];
  
  [[UMSocialManager defaultManager] handleOpenURL:url options:options];
  
  //KBZ 支付
  if([url.scheme containsString:@"Mookee"]) {
      NSString *resultCode = [self getParamByName:@"EXTRA_RESULT" URLString:url.absoluteString];
      NSString *merchant_order_id = [self getParamByName:@"EXTRA_ORDER_ID" URLString:url.absoluteString];
      NSMutableDictionary *params = [NSMutableDictionary new];
      [params setValue:resultCode forKey:@"EXTRA_RESULT"];
      [params setValue:merchant_order_id forKey:@"EXTRA_ORDER_ID"];
      [[NSNotificationCenter defaultCenter] postNotificationName:@"KBZ_PAY" object:nil userInfo:params];
    
    
    NSLog(@"URL scheme:%@",[url scheme]);
    NSLog(@"URL query: %@",[url query]);
    
    //链接唤起app
//    NSLog(@"App的url:%@", url);
  }
  return [RCTLinkingManager application:app openURL:url options:options];
}

/*
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  
 
  
  NSLog(@"Calling Application Bundle ID: %@",sourceApplication);
  NSLog(@"URL scheme:%@",[url scheme]);
  NSLog(@"URL query: %@",[url query]);
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}
*/
 
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  while ([[UIDevice currentDevice] isGeneratingDeviceOrientationNotifications]) {
    [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
  }
  
  return [Orientation getOrientation];
}


//************************************************JPush start************************************************

//注册 APNS 成功并上报 DeviceToken
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
//  [JPUSHService registerDeviceToken:deviceToken];
}

//iOS 7 APNS
- (void)application:(UIApplication *)application didReceiveRemoteNotification:  (NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  // iOS 10 以下 Required
//  NSLog(@"iOS 7 APNS");
//  [JPUSHService handleRemoteNotification:userInfo];
//  [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
//  completionHandler(UIBackgroundFetchResultNewData);
}

//ios 4 本地通知 todo
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification{
//  NSDictionary *userInfo =  notification.userInfo;
//  NSLog(@"iOS 4 本地通知");
//  [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_EVENT object:userInfo];
}

//iOS 10 前台收到消息
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center  willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
//  NSDictionary * userInfo = notification.request.content.userInfo;
//  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//    // Apns
//    NSLog(@"iOS 10 APNS 前台收到消息");
//    [JPUSHService handleRemoteNotification:userInfo];
//    [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
//  }
//  else {
//    // 本地通知 todo
//    NSLog(@"iOS 10 本地通知 前台收到消息");
//    [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_EVENT object:userInfo];
//  }
//  completionHandler(UNNotificationPresentationOptionAlert);// 需要执行这个方法，选择是否提醒用户，有 Badge、Sound、Alert 三种类型可以选择设置
}

//iOS 10 消息事件回调
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler: (void (^)())completionHandler {
//  NSDictionary * userInfo = response.notification.request.content.userInfo;
//  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//    NSLog(@"iOS 10 APNS 消息事件回调");
    // Apns
//    [JPUSHService handleRemoteNotification:userInfo];
    // 保障应用被杀死状态下，用户点击推送消息，打开app后可以收到点击通知事件
//    [[RCTJPushEventQueue sharedInstance]._notificationQueue insertObject:userInfo atIndex:0];
//    [[NSNotificationCenter defaultCenter] postNotificationName:J_APNS_NOTIFICATION_OPENED_EVENT object:userInfo];
//  }
//  else {
//    // 本地通知 todo
//    NSLog(@"iOS 10 本地通知 消息事件回调");
//    [[NSNotificationCenter defaultCenter] postNotificationName:J_LOCAL_NOTIFICATION_EVENT object:userInfo];
//  }
  // 系统要求执行这个方法
  completionHandler();
}

//自定义消息
- (void)networkDidReceiveMessage:(NSNotification *)notification {
//  NSDictionary * userInfo = [notification userInfo];
//  [[NSNotificationCenter defaultCenter] postNotificationName:J_CUSTOM_NOTIFICATION_EVENT object:userInfo];
}

//************************************************JPush end************************************************

@end
