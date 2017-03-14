/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 */

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <CodePush/CodePush.h>

#import "AppDelegate.h"
#import "CodePush.h"

#import "RCTRootView.h"
#import "RCTLinkingManager.h"
#import "RNFIRMessaging.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //FCM
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  //FCM END
  
  
  NSURL *jsCodeLocation;

#ifdef DEBUG
  NSString *ip = [[NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"ip" ofType:@"txt"] encoding:NSUTF8StringEncoding error:nil] stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"\n"]];

  if (!ip) {
    ip = @"127.0.0.1";
  }

  jsCodeLocation = [NSURL URLWithString:[NSString stringWithFormat:@"http://%@:8081/index.ios.bundle?platform=ios&dev=true", ip]];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Clogii"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  NSArray *objects = [[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil];
  UIImageView *loadingView = [[[objects objectAtIndex:0] subviews] objectAtIndex:0];
  loadingView = [[UIImageView alloc] initWithImage:[loadingView image]];
  loadingView.frame = [UIScreen mainScreen].bounds;

  rootView.loadingView = loadingView;

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [[UIApplication sharedApplication] setStatusBarHidden:NO];
  [self.window makeKeyAndVisible];

  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  BOOL handledFB = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
  BOOL handledLinking = [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
  return handledLinking || handledFB;
}

//FCM
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}

//You can skip this method if you don't want to use local notification
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNFIRMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
//FCM END

@end
