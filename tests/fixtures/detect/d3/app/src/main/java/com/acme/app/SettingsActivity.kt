package com.acme.app
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.acme.app.databinding.ActivitySettingsBinding
class SettingsActivity : AppCompatActivity() {
  override fun onCreate(s: Bundle?) { super.onCreate(s); setContentView(ActivitySettingsBinding.inflate(layoutInflater).root) }
}
