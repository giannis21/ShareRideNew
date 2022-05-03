//
//  NativeModuleManager.swift
//  ShareRideNew
//
//  Created by Fragkoulis Ioannis on 2/5/22.
//

import Foundation
@objc (NativeModuleManager)
class NativeModuleManager : NSObject {

@objc
func constantsToExport() -> [AnyHashable : Any]! {
  return ["message": "Hello from native code"]
}
  @objc
  func exitApp() {
      print("Hi, I'm written in Native code, and being consumed in react-native code.")
     // exit(0)
  }

  @objc
      static func requiresMainQueueSetup() -> Bool {
          return true
  }
}
