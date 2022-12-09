<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
require 'vendor/autoload.php';
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Spatie\ImageOptimizer\OptimizerChain;
use Spatie\ImageOptimizer\Optimizers\Jpegoptim;
use Spatie\ImageOptimizer\Optimizers\Pngquant;
use Spatie\ImageOptimizer\Optimizers\Gifsicle;
use Spatie\ImageOptimizer\Optimizers\Optipng;
use Psr\Log\LoggerInterface;
use Psr\Log\Test\TestLogger;

function compressor($FILES, $recompress=false){
    // header('HTTP/1.1 400 Invalid file (test error).');
    // die();
    $ds          = DIRECTORY_SEPARATOR;  //1
     
    $storeFolder = 'uploads';   //2
    if(!$recompress){
        $tempFile = $FILES['file']['tmp_name'];          //3             
        $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;  //4
        $targetFile =  $targetPath. $FILES['file']['name'];  //5
        move_uploaded_file($tempFile,$targetFile); //6
        $JQ=80; $PQ=20; $GQ=184;
        $pathToImage=$targetFile;
        $pathToSave=$targetPath.'optimized'.$FILES['file']['name'];
    }
    else if($recompress){
        $pathToImage=$_SERVER['DOCUMENT_ROOT'].parse_url($FILES['originalfilename'], PHP_URL_PATH); //$FILES = $_POST
        $pathToSave=$_SERVER['DOCUMENT_ROOT'].parse_url($FILES['optimizedfilename'], PHP_URL_PATH); //$FILES = $_POST
        // echo 'path to image in recompression is: '.$pathToImage;die();
        $JQ=(int)$FILES['quality'];//$FILES = $_POST
        $PQ=(int)$FILES['quality'];//$FILES = $_POST
        $GQ=(int)$FILES['quality'];//$FILES = $_POST
        $PQ=100-$PQ;
        $GQ=intval($GQ*1.7 + 30);
    }

        $optimizerChain = new OptimizerChain;
        $jpegQuality = '--max='.$JQ; //0 to 100
        $pngQuality = '--quality='.$PQ; //0 to 100
        $gifQuality = '--lossy='.$GQ; //30 to 200
        $gifSicleObject=new Gifsicle([
                    '-b',
                    '-O3',
                    $gifQuality
                ]);
        $JpegoptimObject=new Jpegoptim([
                    $jpegQuality,
                    '--strip-all',
                    '--all-progressive',
                ]);
        $PngquantObject=new Pngquant([
                    $pngQuality,
                    '--force',
                    '--speed 1'
                ]);
        $OptipngObject=new Optipng([
                    '-i0',
                    '-o2',
                    '-quiet',
                ]);
        $gifSicleObject->setBinaryPath(__DIR__.'/');
        $JpegoptimObject->setBinaryPath('/home/theelect/');
        $PngquantObject->setBinaryPath(__DIR__.'/');
        $OptipngObject->setBinaryPath(__DIR__.'/');
        $optimizerChain->addOptimizer($JpegoptimObject)

                ->addOptimizer($PngquantObject)

                ->addOptimizer($OptipngObject)

                ->addOptimizer($gifSicleObject);

        $logger=new TestLogger();

        $optimizerChain->useLogger($logger)->optimize($pathToImage, $pathToSave);
        if(isset($logger->recordsByLevel['error'])){
            echo "<pre>".print_r($logger, true)."</pre>";
            echo $logger->recordsByLevel['error'][0]['message'];
            header('HTTP/1.1 400 Invalid file.');
            die();
        }
        if(filesize($pathToSave) >= filesize($pathToImage)){
        	//try and see what happens with max compression
        	$jpegQuality = '--max=100'; //0 to 100
	        $pngQuality = '--quality=1'; //0 to 100
	        $gifQuality = '--lossy=200'; //30 to 200
	        $gifSicleObject=new Gifsicle([
	                    '-b',
	                    '-O3',
	                    $gifQuality
	                ]);
	        $JpegoptimObject=new Jpegoptim([
	                    $jpegQuality,
	                    '--strip-all',
	                    '--all-progressive',
	                ]);
	        $PngquantObject=new Pngquant([
	                    $pngQuality,
	                    '--force',
	                    '--speed 1'
	                ]);
	        $OptipngObject=new Optipng([
	                    '-i0',
	                    '-o2',
	                    '-quiet',
	                ]);
	        $gifSicleObject->setBinaryPath(__DIR__.'/');
	        $JpegoptimObject->setBinaryPath('/usr/bin');
	        $PngquantObject->setBinaryPath(__DIR__.'/');
	        $OptipngObject->setBinaryPath(__DIR__.'/');
        	$optimizerChain->addOptimizer($JpegoptimObject)
                ->addOptimizer($PngquantObject)
                ->addOptimizer($OptipngObject)
                ->addOptimizer($gifSicleObject);
        	$optimizerChain->optimize($pathToImage, $pathToSave);
        	if(filesize($pathToSave) >= filesize($pathToImage)){
	        	echo 'File size cannot be reduced anymore';
	            header('HTTP/1.1 400 Invalid file.');
	            die();
        	}
        }

        echo "<pre>".print_r($logger, true)."</pre>";
}
if (!isset($_POST['quality'])) {
    compressor($_FILES);
}

?>   