{ pkgs }: {
  deps = [
    pkgs.python311
    pkgs.python311Packages.flask
    pkgs.python311Packages.stripe
    pkgs.python311Packages.flask_cors
  ];
}
