//
//  BitMapModule.m
//  SlodonApp
//
//  Created by Noah on 2020/3/5.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "BitMapModule.h"
//#import "SDImageCache.h"
#import <React/RCTLog.h>
#import "UIImageView+WebCache.h"

@implementation BitMapModule

RCT_EXPORT_MODULE();

//生成图片
RCT_EXPORT_METHOD(qrCodeUrl:(NSString *)qrCodeUrl code:(NSString *)code) {
  NSArray *bgImageArr = @[@"vip_share_bg_image_1", @"vip_share_bg_image_2", @"vip_share_bg_image_3", @"vip_share_bg_image_4", @"vip_share_bg_image_5", @"vip_share_bg_image_6", @"vip_share_bg_image_7", @"vip_share_bg_image_8", @"vip_share_bg_image_9", @"vip_share_bg_image_10", @"vip_share_bg_image_11", @"vip_share_bg_image_12", @"vip_share_bg_image_13", @"vip_share_bg_image_14", @"vip_share_bg_image_15"];
  
  SDWebImageManager *manager = [SDWebImageManager sharedManager];
  
  __weak typeof(self) weakSelf = self;
  
  //下载二维码图片
  [manager loadImageWithURL:[NSURL URLWithString:qrCodeUrl] options:SDWebImageRefreshCached progress:nil completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error, SDImageCacheType cacheType, BOOL finished, NSURL * _Nullable imageURL) {
    if (image) {
      NSLog(@"二维码图片:%@", image);
      dispatch_async(dispatch_get_main_queue(), ^{
        __strong typeof(self) strongSelf = weakSelf;
        for (int i = 0; i<bgImageArr.count; i++) {
          NSString *codeStr = @"";
          if (i < 10) {
            codeStr = [NSString stringWithFormat:@"Invite Code %@", code];
          } else {
            codeStr = [NSString stringWithFormat:@"邀请码 %@", code];
          }
          [strongSelf waterImageWithQrCode:image code:code bgImageName:bgImageArr[i] index:i];
        }
        [self sendEventWithName:@"QrCodeImageReminder" body:@{}];
      });
    }
  }];
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"QrCodeImageReminder"];
}

- (void)waterImageWithQrCode:(UIImage *)qrCode code:(NSString *)code bgImageName:(NSString *)bgImageName index:(int)index {
  UIImage *bgImage = [UIImage imageNamed:bgImageName];
  
  UIGraphicsBeginImageContextWithOptions(bgImage.size, NO, 1.0);
  
  [bgImage drawInRect:CGRectMake(0, 0, bgImage.size.width, bgImage.size.height)];
  
  //绘制二维码
  CGFloat waterW_qr = 107;
  CGFloat waterH_qr = 107;
  CGFloat waterX_qr = 134;
  CGFloat waterY_qr = 449;
  [qrCode drawInRect:CGRectMake(waterX_qr, waterY_qr, waterW_qr, waterH_qr)];
  
  //绘制邀请码
  UIImage *codeImage = [self imageWithText:code font:[UIFont systemFontOfSize:12] size:CGSizeMake(137, 26) textAlignment:NSTextAlignmentCenter];
  CGFloat waterW_code = 137;
  CGFloat waterH_code = 26;
  CGFloat waterX_code = (bgImage.size.width-waterW_code)/2;
  CGFloat waterY_code = waterY_qr + waterH_qr + 14;
  [codeImage drawInRect:CGRectMake(waterX_code, waterY_code, waterW_code, waterH_code)];
  
  //生成大图
  UIImage *newImage_big = UIGraphicsGetImageFromCurrentImageContext();
  
  UIGraphicsEndImageContext();
  
  //生成小图
  UIImage *newImage_small = [self scalImage:newImage_big size:CGSizeMake(160, newImage_big.size.height/newImage_big.size.width*160)];
  
  NSString *path = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
  
  if (path) {
    //小图
    NSString *newImageName_small = [NSString stringWithFormat:@"newImage_small_%d.png", index];
    NSString *filePath_small = [path stringByAppendingPathComponent:newImageName_small];
    [UIImagePNGRepresentation(newImage_small) writeToFile:filePath_small atomically:YES];
    
    //大图
    NSString *newImageName_big = [NSString stringWithFormat:@"newImage_big_%d.png", index];
    NSString *filePath_big = [path stringByAppendingPathComponent:newImageName_big];
    [UIImagePNGRepresentation(newImage_big) writeToFile:filePath_big atomically:YES];
  }
}

//图片压缩
- (UIImage *)scalImage:(UIImage *)image size:(CGSize)size {
  
  UIGraphicsBeginImageContext(CGSizeMake(size.width, size.height));
  [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
  UIImage *resizeImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return resizeImage;
}

//文字转图片
- (UIImage *)imageWithText:(NSString *)text font:(UIFont *)font size:(CGSize)size textAlignment:(NSTextAlignment)textAlignment {
  
  UIGraphicsBeginImageContext(size);
  CGContextRef context = UIGraphicsGetCurrentContext();
  
  [[UIColor colorWithRed:1 green:1 blue:1 alpha:0.0] set];
  
  CGRect rect = CGRectMake(0, 0, size.width, size.height);
  CGContextFillRect(context, rect);
  
  NSMutableParagraphStyle *paragraph = [[NSMutableParagraphStyle alloc] init];
  paragraph.alignment = textAlignment;
  
  NSShadow *shadow = [[NSShadow alloc] init];
  shadow.shadowBlurRadius = 0; //模糊度
  shadow.shadowColor = [UIColor whiteColor];
  shadow.shadowOffset = CGSizeMake(0, 0);
  
  NSDictionary *attributes = @{
    NSForegroundColorAttributeName:[UIColor whiteColor],
    NSFontAttributeName:font,
    NSShadowAttributeName:shadow,
    NSParagraphStyleAttributeName:paragraph,
  };
  
  [text drawInRect:rect withAttributes:attributes];
  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  
  UIGraphicsEndImageContext();
  
  return image;
}

@end
