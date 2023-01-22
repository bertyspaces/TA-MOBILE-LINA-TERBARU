if(window.openDatabase){
  var mydb = openDatabase("catering", '1.0', "WebSQL Database", 2 * 1024 * 1024);
  mydb.transaction(function(tx){
    
		tx.executeSql("create table if not exists user(username varchar(25) primary key, password varchar(25))");
    tx.executeSql("insert into user values('milea','pass')");
    tx.executeSql("create table if not exists data_pesanan(no_pesanan varchar(25) primary key, nama_pesanan varchar(25),pelanggan varchar(25), alamat varchar (35), no_telp varchar (13), tgl_booking date, jam_ambil time, jumlah_order varchar(25), hargaAwal varchar(25), pembayaran varchar (25))");
    tx.executeSql("insert into data_pesanan values('1','snack-snack+aqua','lina','kepatihan', '5545','4545','1905','5000','FP')");
  
  });
}else{
  alert("Browser tidak mendukung WebSQL");
}

function login(){
	var username = document.getElementById("username").value;
  mydb.transaction(function(tx){
		tx.executeSql("select * from user where username = ?", [username], validasi);            
  });
}

function validasi(transaction, results){
  var pass = document.getElementById("password").value;
  if(results.rows.length == 0){
    ons.notification.alert("Username salah");    
  }else{
    var row = results.rows.item(0);
		if(row.password == pass){            
      myNavigator.pushPage('homepage');
    }else{
      ons.notification.alert("Password salah");
      reset();
    }
  }
}

function reset(){
 document.getElementById("username").value = "";
 document.getElementById("password").value = "";
}

function input_data() {
  var no_pesanan = document.getElementById('no_pesanan').value;
  var nama_pesanan = document.getElementById('nama_pesanan').value;
  var pelanggan = document.getElementById('pelanggan').value;
  var alamat = document.getElementById('alamat').value;
  var no_telp = document.getElementById('no_telp').value;
  var tgl_booking = document.getElementById('tgl_booking').value;
  var jam_ambil = document.getElementById('jam_ambil').value;
  var jumlah_order = document.getElementById('numberPlace').textContent;
  var hargaAwal = document.getElementById('nama').value;
  var pembayaran;
  if(document.getElementById('fp').checked){
    pembayaran = 'LUNAS';
  }else if(document.getElementById('dp').checked){
    pembayaran = 'DP 50%';
  
  }
  mydb.transaction(function (tx) {
    tx.executeSql("insert into data_pesanan values (?,?,?,?,?,?,?,?,?,?)", [no_pesanan,nama_pesanan, pelanggan, alamat, no_telp, tgl_booking, jam_ambil, jumlah_order, hargaAwal, pembayaran]);    
  });
	alert("data telah tersimpan");
  fn.load('daftar_pesanan.html');
}


tampil_data();
function tampil_data(){
  mydb.transaction(function(tx){
    tx.executeSql("select * from data_pesanan",[], ambil_data);
  });    
}

function ambil_data(transaction, results){
  var list_holder=document.getElementById("list-data");
  list_holder.innerHTML = "";

  var i;
  for(i=0; i<results.rows.length;i++){
    var row=results.rows.item(i);
		list_holder.innerHTML+="<ons-list-item><ons-col width='26%'><div class='left'>" +row.no_pesanan+"</div></ons-col><ons-col width='27%'><div class='center'>" +row.pelanggan+ "</div></ons-col><ons-col width='27%'><div class='center'>" +row.tgl_booking+ "</div></ons-col><ons-col width='20%'><div class='right'><a onclick='detail(\""+row.no_pesanan+"\",\""+row.pelanggan+"\",\""+row.alamat+"\",\""+row.no_telp+"\",\""+row.tgl_booking+"\",\""+row.jam_ambil+"\",\""+row.jumlah_order+"\",\""+row.hargaAwal+"\",\""+row.pembayaran+"\");'><ons-icon icon='fa-eye'></ons-icon></a>&emsp;<a onclick='hapus_data(\""+row.no_pesanan+"\");'><ons-icon icon='fa-trash'></ons-icon></a></div></ons-col></ons-list-item>";    
  }
}

function detail(no_pesanan,pelanggan) {
 console.log(pelanggan);
  mydb.transaction(function(tx){
    tx.executeSql("select * from data_pesanan where no_pesanan=? ",[no_pesanan], data_detail);
  }); 
  // document.getElementById("d_no").innerHTML="dsdsd";
  fn.load('detail.html');
  
  
}
function data_detail(transaction, results) {

  for(i=0; i<results.rows.length;i++){
    // var nomor=i+1;
    var row=results.rows.item(i);
    // judul.innerHTML=row.judul;
    // tanggal.innerHTML=row.tanggal;
    // kategori.innerHTML=row.kategori;
    // catatan.innerHTML=row.catatan;
    document.getElementById("d_paket").innerHTML=row.nama_pesanan;
    document.getElementById("d_no").innerHTML=row.no_pesanan;
    document.getElementById("d_pelanggan").innerHTML=row.pelanggan;
    document.getElementById("d_alamat").innerHTML=row.alamat;
    document.getElementById("d_telepon").innerHTML=row.no_telp;
    document.getElementById("d_tanggal").innerHTML=row.tgl_booking;
    document.getElementById("d_jam").innerHTML=row.jam_ambil;
    document.getElementById("d_harga").innerHTML=row.jumlah_order;
    document.getElementById("d_total").innerHTML=row.hargaAwal;
    document.getElementById("d_pembayaran").innerHTML=row.pembayaran;
    
  };

  
}

function hapus_data(no_pesanan){
  var konfirmasi = confirm("Anda yakin akan menghapus data " +no_pesanan+ " ? ");
  if(konfirmasi){
    mydb.transaction(function(t){
			t.executeSql("delete from data_pesanan where no_pesanan = ?", [no_pesanan], tampil_data);
    });		
  }
	alert("data berhasil dihapus");
}

function clear_form(){
	document.getElementById('no_pesanan').value = "";
	document.getElementById('pelanggan').value = "";
  document.getElementById('alamat').value = "";
  document.getElementById('no_telp').value = "";
  document.getElementById('tgl_booking').value = "";
  document.getElementById('jam_ambil').value = "";
  document.getElementById('nama').value = "";
	document.getElementById('fp').checked = false;
	document.getElementById('dp').checked = false;
}	                                                                                                                                                     



window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  tampil_data();
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

window.fn.snack = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.snack1 = function(page) { 
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.snack2 = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.snack3 = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.berkat = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.berkat1 = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.berkat2 = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.berkat3 = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.aqiqoh = function(page) {
  
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
  
};

window.fn.aqiqoh1 = function(page) {
  
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

window.fn.aqiqoh2 = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
window.fn.aqiqoh3 = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

var number = 0;

var hargaAwal=parseInt(number);
function plus() {
  var plusBtn = document.getElementById("plus"),
  numberPlace = document.getElementById("numberPlace"),
  hargaPkt=parseInt(document.getElementById("hargaAwal").value),
  min = 0, 
  max = 1000; 
 
  if(number<max){
    number = number+1;
    numberPlace.innerText = number ; 
    document.getElementById("nama").value =hargaPkt *number ;
 }     
 if(number == max){
        numberPlace.style.color= "red";
        setTimeout(function(){numberPlace.style.color= "black"},500)
 }
    
 else {
        numberPlace.style.color= "black";
        
 }
}

function minus() {
  var minusBtn = document.getElementById("minus"),
  numberPlace = document.getElementById("numberPlace"),
  hargaPkt=parseInt(document.getElementById("hargaAwal").value),
  min = 0, 
  max = 1000; 

  if (number>min){
    number = number-1; /// minus 1
    numberPlace.innerText = number ;
    document.getElementById("nama").value =hargaPkt * number;
    
    
 }
 if(number == min) {        
     numberPlace.style.color= "red";
     document.getElementById("nama").value =hargaPkt;
     setTimeout(function(){numberPlace.style.color= "black"},500)
 }
 else {
   numberPlace.style.color="black";            
    }
}




