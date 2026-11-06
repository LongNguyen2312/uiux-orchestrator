plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }
android {
    namespace = "com.acme.app"
    compileSdk = 35
    defaultConfig { minSdk = 26; targetSdk = 35 }
    buildFeatures { viewBinding = true }
}
dependencies {
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.2.1")
    implementation("androidx.recyclerview:recyclerview:1.4.0")
}
