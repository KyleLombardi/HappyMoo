#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import "RCTAppleHealthKit.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  /* set bridge for react native */
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self
                                              launchOptions:launchOptions];
  /* Add Background initializer for HealthKit  */
  [[RCTAppleHealthKit new] initializeBackgroundObservers:bridge];
  
  self.moduleName = @"Moody";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
