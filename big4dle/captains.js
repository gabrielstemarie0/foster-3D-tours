// Each team's captain (official where the league has them, otherwise the franchise star) and their country.
// Compiled from memory: rosters change, so treat as approximate.
const CAPTAINS = {
 "Arizona Cardinals": {
  "name": "Kyler Murray",
  "country": "us"
 },
 "Atlanta Falcons": {
  "name": "Bijan Robinson",
  "country": "us"
 },
 "Baltimore Ravens": {
  "name": "Lamar Jackson",
  "country": "us"
 },
 "Buffalo Bills": {
  "name": "Josh Allen",
  "country": "us"
 },
 "Carolina Panthers": {
  "name": "Bryce Young",
  "country": "us"
 },
 "Chicago Bears": {
  "name": "Caleb Williams",
  "country": "us"
 },
 "Cincinnati Bengals": {
  "name": "Joe Burrow",
  "country": "us"
 },
 "Cleveland Browns": {
  "name": "Myles Garrett",
  "country": "us"
 },
 "Dallas Cowboys": {
  "name": "Dak Prescott",
  "country": "us"
 },
 "Denver Broncos": {
  "name": "Bo Nix",
  "country": "us"
 },
 "Detroit Lions": {
  "name": "Jared Goff",
  "country": "us"
 },
 "Green Bay Packers": {
  "name": "Jordan Love",
  "country": "us"
 },
 "Houston Texans": {
  "name": "C.J. Stroud",
  "country": "us"
 },
 "Indianapolis Colts": {
  "name": "Jonathan Taylor",
  "country": "us"
 },
 "Jacksonville Jaguars": {
  "name": "Trevor Lawrence",
  "country": "us"
 },
 "Kansas City Chiefs": {
  "name": "Patrick Mahomes",
  "country": "us"
 },
 "Las Vegas Raiders": {
  "name": "Maxx Crosby",
  "country": "us"
 },
 "Los Angeles Chargers": {
  "name": "Justin Herbert",
  "country": "us"
 },
 "Los Angeles Rams": {
  "name": "Matthew Stafford",
  "country": "us"
 },
 "Miami Dolphins": {
  "name": "Tua Tagovailoa",
  "country": "us"
 },
 "Minnesota Vikings": {
  "name": "Justin Jefferson",
  "country": "us"
 },
 "New England Patriots": {
  "name": "Drake Maye",
  "country": "us"
 },
 "New Orleans Saints": {
  "name": "Alvin Kamara",
  "country": "us"
 },
 "New York Giants": {
  "name": "Dexter Lawrence",
  "country": "us"
 },
 "New York Jets": {
  "name": "Sauce Gardner",
  "country": "us"
 },
 "Philadelphia Eagles": {
  "name": "Jalen Hurts",
  "country": "us"
 },
 "Pittsburgh Steelers": {
  "name": "T.J. Watt",
  "country": "us"
 },
 "San Francisco 49ers": {
  "name": "George Kittle",
  "country": "us"
 },
 "Seattle Seahawks": {
  "name": "Geno Smith",
  "country": "us"
 },
 "Tampa Bay Buccaneers": {
  "name": "Baker Mayfield",
  "country": "us"
 },
 "Tennessee Titans": {
  "name": "Cam Ward",
  "country": "us"
 },
 "Washington Commanders": {
  "name": "Jayden Daniels",
  "country": "us"
 },
 "Arizona Diamondbacks": {
  "name": "Corbin Carroll",
  "country": "us"
 },
 "Atlanta Braves": {
  "name": "Ronald Acuña Jr.",
  "country": "ve"
 },
 "Baltimore Orioles": {
  "name": "Gunnar Henderson",
  "country": "us"
 },
 "Boston Red Sox": {
  "name": "Alex Bregman",
  "country": "us"
 },
 "Chicago Cubs": {
  "name": "Seiya Suzuki",
  "country": "jp"
 },
 "Chicago White Sox": {
  "name": "Luis Robert Jr.",
  "country": "cu"
 },
 "Cincinnati Reds": {
  "name": "Elly De La Cruz",
  "country": "do"
 },
 "Cleveland Guardians": {
  "name": "José Ramírez",
  "country": "do"
 },
 "Colorado Rockies": {
  "name": "Ryan McMahon",
  "country": "us"
 },
 "Detroit Tigers": {
  "name": "Tarik Skubal",
  "country": "us"
 },
 "Houston Astros": {
  "name": "Yordan Alvarez",
  "country": "cu"
 },
 "Kansas City Royals": {
  "name": "Bobby Witt Jr.",
  "country": "us"
 },
 "Los Angeles Angels": {
  "name": "Mike Trout",
  "country": "us"
 },
 "Los Angeles Dodgers": {
  "name": "Shohei Ohtani",
  "country": "jp"
 },
 "Miami Marlins": {
  "name": "Sandy Alcántara",
  "country": "do"
 },
 "Milwaukee Brewers": {
  "name": "Christian Yelich",
  "country": "us"
 },
 "Minnesota Twins": {
  "name": "Byron Buxton",
  "country": "us"
 },
 "New York Mets": {
  "name": "Francisco Lindor",
  "country": "pr"
 },
 "New York Yankees": {
  "name": "Aaron Judge",
  "country": "us"
 },
 "Oakland Athletics": {
  "name": "Brent Rooker",
  "country": "us"
 },
 "Philadelphia Phillies": {
  "name": "Bryce Harper",
  "country": "us"
 },
 "Pittsburgh Pirates": {
  "name": "Paul Skenes",
  "country": "us"
 },
 "San Diego Padres": {
  "name": "Fernando Tatis Jr.",
  "country": "do"
 },
 "San Francisco Giants": {
  "name": "Willy Adames",
  "country": "do"
 },
 "Seattle Mariners": {
  "name": "Julio Rodríguez",
  "country": "do"
 },
 "St. Louis Cardinals": {
  "name": "Nolan Arenado",
  "country": "us"
 },
 "Tampa Bay Rays": {
  "name": "Junior Caminero",
  "country": "do"
 },
 "Texas Rangers": {
  "name": "Corey Seager",
  "country": "us"
 },
 "Toronto Blue Jays": {
  "name": "Vladimir Guerrero Jr.",
  "country": "do"
 },
 "Washington Nationals": {
  "name": "James Wood",
  "country": "us"
 },
 "Atlanta Hawks": {
  "name": "Trae Young",
  "country": "us"
 },
 "Boston Celtics": {
  "name": "Jayson Tatum",
  "country": "us"
 },
 "Brooklyn Nets": {
  "name": "Cam Thomas",
  "country": "us"
 },
 "Charlotte Hornets": {
  "name": "LaMelo Ball",
  "country": "us"
 },
 "Chicago Bulls": {
  "name": "Josh Giddey",
  "country": "au"
 },
 "Cleveland Cavaliers": {
  "name": "Donovan Mitchell",
  "country": "us"
 },
 "Dallas Mavericks": {
  "name": "Cooper Flagg",
  "country": "us"
 },
 "Denver Nuggets": {
  "name": "Nikola Jokić",
  "country": "rs"
 },
 "Detroit Pistons": {
  "name": "Cade Cunningham",
  "country": "us"
 },
 "Golden State Warriors": {
  "name": "Stephen Curry",
  "country": "us"
 },
 "Houston Rockets": {
  "name": "Alperen Şengün",
  "country": "tr"
 },
 "Indiana Pacers": {
  "name": "Tyrese Haliburton",
  "country": "us"
 },
 "Los Angeles Clippers": {
  "name": "Kawhi Leonard",
  "country": "us"
 },
 "Los Angeles Lakers": {
  "name": "Luka Dončić",
  "country": "si"
 },
 "Memphis Grizzlies": {
  "name": "Ja Morant",
  "country": "us"
 },
 "Miami Heat": {
  "name": "Bam Adebayo",
  "country": "us"
 },
 "Milwaukee Bucks": {
  "name": "Giannis Antetokounmpo",
  "country": "gr"
 },
 "Minnesota Timberwolves": {
  "name": "Anthony Edwards",
  "country": "us"
 },
 "New Orleans Pelicans": {
  "name": "Zion Williamson",
  "country": "us"
 },
 "New York Knicks": {
  "name": "Jalen Brunson",
  "country": "us"
 },
 "Oklahoma City Thunder": {
  "name": "Shai Gilgeous-Alexander",
  "country": "ca"
 },
 "Orlando Magic": {
  "name": "Franz Wagner",
  "country": "de"
 },
 "Philadelphia 76ers": {
  "name": "Joel Embiid",
  "country": "cm"
 },
 "Phoenix Suns": {
  "name": "Devin Booker",
  "country": "us"
 },
 "Portland Trail Blazers": {
  "name": "Deni Avdija",
  "country": "il"
 },
 "Sacramento Kings": {
  "name": "Domantas Sabonis",
  "country": "lt"
 },
 "San Antonio Spurs": {
  "name": "Victor Wembanyama",
  "country": "fr"
 },
 "Toronto Raptors": {
  "name": "Scottie Barnes",
  "country": "us"
 },
 "Utah Jazz": {
  "name": "Lauri Markkanen",
  "country": "fi"
 },
 "Washington Wizards": {
  "name": "Alex Sarr",
  "country": "fr"
 },
 "Anaheim Ducks": {
  "name": "Radko Gudas",
  "country": "cz"
 },
 "Boston Bruins": {
  "name": "Charlie McAvoy",
  "country": "us"
 },
 "Buffalo Sabres": {
  "name": "Rasmus Dahlin",
  "country": "se"
 },
 "Calgary Flames": {
  "name": "Mikael Backlund",
  "country": "se"
 },
 "Carolina Hurricanes": {
  "name": "Jordan Staal",
  "country": "ca"
 },
 "Chicago Blackhawks": {
  "name": "Nick Foligno",
  "country": "us"
 },
 "Colorado Avalanche": {
  "name": "Gabriel Landeskog",
  "country": "se"
 },
 "Columbus Blue Jackets": {
  "name": "Boone Jenner",
  "country": "ca"
 },
 "Dallas Stars": {
  "name": "Jamie Benn",
  "country": "ca"
 },
 "Detroit Red Wings": {
  "name": "Dylan Larkin",
  "country": "us"
 },
 "Edmonton Oilers": {
  "name": "Connor McDavid",
  "country": "ca"
 },
 "Florida Panthers": {
  "name": "Aleksander Barkov",
  "country": "fi"
 },
 "Los Angeles Kings": {
  "name": "Anže Kopitar",
  "country": "si"
 },
 "Minnesota Wild": {
  "name": "Jared Spurgeon",
  "country": "ca"
 },
 "Montreal Canadiens": {
  "name": "Nick Suzuki",
  "country": "ca"
 },
 "Nashville Predators": {
  "name": "Roman Josi",
  "country": "ch"
 },
 "New Jersey Devils": {
  "name": "Nico Hischier",
  "country": "ch"
 },
 "New York Islanders": {
  "name": "Anders Lee",
  "country": "us"
 },
 "New York Rangers": {
  "name": "J.T. Miller",
  "country": "us"
 },
 "Ottawa Senators": {
  "name": "Brady Tkachuk",
  "country": "us"
 },
 "Philadelphia Flyers": {
  "name": "Sean Couturier",
  "country": "ca"
 },
 "Pittsburgh Penguins": {
  "name": "Sidney Crosby",
  "country": "ca"
 },
 "San Jose Sharks": {
  "name": "Logan Couture",
  "country": "ca"
 },
 "Seattle Kraken": {
  "name": "Jordan Eberle",
  "country": "ca"
 },
 "St. Louis Blues": {
  "name": "Brayden Schenn",
  "country": "ca"
 },
 "Tampa Bay Lightning": {
  "name": "Victor Hedman",
  "country": "se"
 },
 "Toronto Maple Leafs": {
  "name": "Auston Matthews",
  "country": "us"
 },
 "Utah Mammoth": {
  "name": "Clayton Keller",
  "country": "us"
 },
 "Vancouver Canucks": {
  "name": "Quinn Hughes",
  "country": "us"
 },
 "Vegas Golden Knights": {
  "name": "Mark Stone",
  "country": "ca"
 },
 "Washington Capitals": {
  "name": "Alex Ovechkin",
  "country": "ru"
 },
 "Winnipeg Jets": {
  "name": "Adam Lowry",
  "country": "ca"
 },
 "Houston Oilers": {
  "name": "Earl Campbell",
  "country": "us"
 },
 "Baltimore Colts": {
  "name": "Johnny Unitas",
  "country": "us"
 },
 "Washington Redskins": {
  "name": "Sammy Baugh",
  "country": "us"
 },
 "St. Louis Cardinals (NFL)": {
  "name": "Larry Wilson",
  "country": "us"
 },
 "Boston Patriots": {
  "name": "Gino Cappelletti",
  "country": "us"
 },
 "Tampa Bay Buccaneers (1976–96)": {
  "name": "Lee Roy Selmon",
  "country": "us"
 },
 "Montreal Expos": {
  "name": "Vladimir Guerrero",
  "country": "do"
 },
 "New York Giants (baseball)": {
  "name": "Willie Mays",
  "country": "us"
 },
 "Boston Braves": {
  "name": "Warren Spahn",
  "country": "us"
 },
 "Seattle Pilots": {
  "name": "Jim Bouton",
  "country": "us"
 },
 "Kansas City Athletics": {
  "name": "Bert Campaneris",
  "country": "cu"
 },
 "Philadelphia Athletics": {
  "name": "Jimmie Foxx",
  "country": "us"
 },
 "St. Louis Browns": {
  "name": "George Sisler",
  "country": "us"
 },
 "Florida Marlins": {
  "name": "Miguel Cabrera",
  "country": "ve"
 },
 "Tampa Bay Devil Rays": {
  "name": "Carl Crawford",
  "country": "us"
 },
 "California Angels": {
  "name": "Nolan Ryan",
  "country": "us"
 },
 "Cleveland Indians": {
  "name": "Omar Vizquel",
  "country": "ve"
 },
 "Houston Colt .45s": {
  "name": "Jimmy Wynn",
  "country": "us"
 },
 "Seattle SuperSonics": {
  "name": "Gary Payton",
  "country": "us"
 },
 "New Jersey Nets": {
  "name": "Jason Kidd",
  "country": "us"
 },
 "Vancouver Grizzlies": {
  "name": "Shareef Abdur-Rahim",
  "country": "us"
 },
 "Charlotte Bobcats": {
  "name": "Gerald Wallace",
  "country": "us"
 },
 "New Orleans Hornets": {
  "name": "Chris Paul",
  "country": "us"
 },
 "Washington Bullets": {
  "name": "Wes Unseld",
  "country": "us"
 },
 "Kansas City Kings": {
  "name": "Otis Birdsong",
  "country": "us"
 },
 "San Diego Clippers": {
  "name": "Bill Walton",
  "country": "us"
 },
 "New Orleans Jazz": {
  "name": "Pete Maravich",
  "country": "us"
 },
 "Minneapolis Lakers": {
  "name": "George Mikan",
  "country": "us"
 },
 "Syracuse Nationals": {
  "name": "Dolph Schayes",
  "country": "us"
 },
 "Buffalo Braves": {
  "name": "Bob McAdoo",
  "country": "us"
 },
 "Cincinnati Royals": {
  "name": "Oscar Robertson",
  "country": "us"
 },
 "Philadelphia Warriors": {
  "name": "Wilt Chamberlain",
  "country": "us"
 },
 "Hartford Whalers": {
  "name": "Ron Francis",
  "country": "ca"
 },
 "Quebec Nordiques": {
  "name": "Joe Sakic",
  "country": "ca"
 },
 "Minnesota North Stars": {
  "name": "Neal Broten",
  "country": "us"
 },
 "Atlanta Thrashers": {
  "name": "Ilya Kovalchuk",
  "country": "ru"
 },
 "Winnipeg Jets (1972–96)": {
  "name": "Teemu Selänne",
  "country": "fi"
 },
 "Atlanta Flames": {
  "name": "Tom Lysiak",
  "country": "ca"
 },
 "Colorado Rockies (NHL)": {
  "name": "Wilf Paiement",
  "country": "ca"
 },
 "Cleveland Barons": {
  "name": "Dennis Maruk",
  "country": "ca"
 },
 "California Golden Seals": {
  "name": "Joey Johnston",
  "country": "ca"
 },
 "Arizona Coyotes": {
  "name": "Shane Doan",
  "country": "ca"
 },
 "Mighty Ducks of Anaheim": {
  "name": "Paul Kariya",
  "country": "ca"
 },
 "Montreal Maroons": {
  "name": "Nels Stewart",
  "country": "ca"
 },
 "Hamilton Tigers": {
  "name": "Babe Dye",
  "country": "ca"
 },
 "Philadelphia Quakers": {
  "name": "Syd Howe",
  "country": "ca"
 }
};
const COUNTRIES = {us:"United States",ca:"Canada",se:"Sweden",fi:"Finland",ru:"Russia",cz:"Czechia",ch:"Switzerland",de:"Germany",fr:"France",rs:"Serbia",gr:"Greece",si:"Slovenia",cm:"Cameroon",au:"Australia",tr:"Turkey",il:"Israel",lt:"Lithuania",do:"Dominican Republic",ve:"Venezuela",cu:"Cuba",jp:"Japan",pr:"Puerto Rico"};
for (const s of Object.values(TEAMS)) for (const t of s.alltime) t.cap = CAPTAINS[t.name];
