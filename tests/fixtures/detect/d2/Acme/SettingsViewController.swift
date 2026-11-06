import UIKit

final class SettingsViewController: UITableViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Settings"
        navigationController?.navigationBar.prefersLargeTitles = true
    }
}
