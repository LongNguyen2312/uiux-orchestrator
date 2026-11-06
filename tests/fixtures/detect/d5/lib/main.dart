import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';

void main() => runApp(const AcmeApp());

class AcmeApp extends StatelessWidget {
  const AcmeApp({super.key});
  @override
  Widget build(BuildContext context) => const CupertinoApp(home: CupertinoPageScaffold(child: Center(child: Text('Settings'))));
}
